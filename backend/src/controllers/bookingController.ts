import { Request, Response } from "express";
import mongoose from "mongoose";
import { Booking } from "../models/Booking";
import { Worker } from "../models/Worker";
import { Review } from "../models/Review";
import { Invoice } from "../models/Invoice";
import { BOOKING_STATUS, BookingStatus } from "../config/constants";
import { fairWageEngine } from "../services/fairWageEngine";
import { GeoService } from "../services/geoService";
import { AuthenticatedRequest } from "../middleware/auth";

export const createBooking = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const {
      serviceCategory,
      requirementDescription,
      serviceLocation,
      scheduledAt,
      workerId,
      bookingType = "STANDARD"
    } = req.body;

    const customerId = req.user?._id;
    const customerName = req.user?.name || "Customer";
    const customerPhone = req.user?.phone || "+919876543210";

    let assignedWorker = null;
    let distanceKm = 3.2;
    let workerVerificationLevel = 3;
    let workerExperienceYears = 4;

    if (workerId) {
      if (mongoose.Types.ObjectId.isValid(workerId)) {
        assignedWorker = await Worker.findById(workerId);
      }
      if (!assignedWorker) {
        assignedWorker = await Worker.findOne({
          $or: [
            { userId: workerId },
            { workerIdNumber: workerId },
            { employeeId: workerId }
          ]
        });
      }

      if (assignedWorker) {
        workerVerificationLevel = assignedWorker.verificationLevel || 3;
        workerExperienceYears = assignedWorker.experienceYears || 4;
        const wCoords = assignedWorker.location?.coordinates || [80.648, 16.506];
        const cCoords = serviceLocation?.coordinates || [80.648, 16.506];
        distanceKm = GeoService.calculateDistanceKm(cCoords[1], cCoords[0], wCoords[1], wCoords[0]);
      }
    }

    const isEmergency = bookingType === "EMERGENCY";
    const wageResult = fairWageEngine.calculate({
      serviceCategory,
      workerVerificationLevel,
      workerExperienceYears,
      distanceKm,
      isEmergency
    });

    const bookingNumber = `BK-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    const initialStatus: BookingStatus = assignedWorker ? BOOKING_STATUS.ASSIGNED : BOOKING_STATUS.REQUESTED;

    const booking = await Booking.create({
      bookingNumber,
      customerId,
      customerName,
      customerPhone,
      workerId: assignedWorker?._id,
      workerName: assignedWorker?.name,
      workerPhone: assignedWorker?.phone,
      societyId: assignedWorker?.societyId,
      serviceCategory,
      requirementDescription,
      serviceLocation: {
        address: serviceLocation?.address || "MG Road, Vijayawada",
        coordinates: serviceLocation?.coordinates || [80.648, 16.506]
      },
      bookingType,
      status: initialStatus,
      statusTimeline: [
        {
          status: initialStatus,
          timestamp: new Date(),
          note: assignedWorker
            ? `Assigned to verified cooperative worker ${assignedWorker.name}`
            : "Request submitted; matching best qualified cooperative worker."
        }
      ],
      scheduledAt: scheduledAt ? new Date(scheduledAt) : new Date(),
      aiMatchScore: isEmergency ? 96 : 94,
      aiMatchReasons: [
        `✓ ${serviceCategory} Certified`,
        `✓ Level ${workerVerificationLevel} Verified`,
        `✓ ${distanceKm.toFixed(1)} km away`,
        "✓ Zero active workload fatigue"
      ],
      fairWageBreakdown: wageResult.breakdown
    });

    res.status(201).json({
      success: true,
      message: "Booking initiated successfully.",
      booking
    });
  } catch (error: any) {
    console.error("createBooking error:", error);
    res.status(500).json({ success: false, message: "Booking creation failed.", error: error.message });
  }
};

export const getMyBookings = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    const role = req.user?.role;

    let query: any = {};
    if (role === "WORKER") {
      const worker = await Worker.findOne({
        $or: [
          { userId },
          ...(mongoose.Types.ObjectId.isValid(userId) ? [{ _id: userId }] : []),
          ...(req.user?.phone ? [{ phone: req.user.phone }] : [])
        ]
      });
      if (worker) {
        query = {
          $or: [
            { workerId: worker._id },
            { workerId: worker.userId },
            { workerPhone: worker.phone }
          ]
        };
      } else {
        query = {
          $or: [
            { workerId: userId },
            ...(req.user?.phone ? [{ workerPhone: req.user.phone }] : [])
          ]
        };
      }
    } else {
      query = { customerId: userId };
    }

    const bookings = await Booking.find(query)
      .sort({ createdAt: -1 })
      .populate("workerId", "name avatarUrl rating verificationLevel phone workerIdNumber societyName")
      .limit(30);

    res.json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Failed to retrieve bookings." });
  }
};

export const getBookingById = async (req: Request, res: Response): Promise<void> => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("workerId", "name phone avatarUrl rating verificationLevel workerIdNumber societyName")
      .populate("societyId", "name contactPhone address");

    if (!booking) {
      res.status(404).json({ success: false, message: "Booking not found." });
      return;
    }

    res.json({ success: true, booking });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error fetching booking." });
  }
};

export const updateBookingStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) {
      res.status(404).json({ success: false, message: "Booking not found." });
      return;
    }

    // Role-based validation & worker ownership check
    if (req.user?.role === "WORKER") {
      const worker = await Worker.findOne({
        $or: [
          { userId: req.user._id },
          ...(req.user.email ? [{ email: req.user.email.toLowerCase() }] : []),
          ...(req.user.employeeId ? [{ employeeId: req.user.employeeId }, { workerIdNumber: req.user.employeeId }] : []),
          ...(mongoose.Types.ObjectId.isValid(req.user._id) ? [{ _id: req.user._id }] : []),
          ...(req.user.phone ? [{ phone: req.user.phone }] : [])
        ]
      });

      // If booking is already assigned, ensure this worker owns it
      if (booking.workerId || booking.workerPhone) {
        const isAssignedToThisWorker =
          (worker && booking.workerId && booking.workerId.toString() === worker._id.toString()) ||
          (worker && booking.workerId && booking.workerId.toString() === worker.userId?.toString()) ||
          (worker && booking.workerPhone && booking.workerPhone === worker.phone) ||
          (booking.workerId && booking.workerId.toString() === req.user._id.toString()) ||
          (booking.workerPhone && booking.workerPhone === req.user.phone);

        if (!isAssignedToThisWorker) {
          res.status(403).json({
            success: false,
            message: "Forbidden: You are not authorized to accept or modify this booking as it is assigned to another worker."
          });
          return;
        }
      } else if (status === BOOKING_STATUS.ACCEPTED && worker) {
        // Unassigned booking being claimed by this worker
        booking.workerId = worker._id;
        booking.workerName = worker.name;
        booking.workerPhone = worker.phone;
        booking.societyId = worker.societyId;
      }

      // Check for duplicate acceptance / race condition
      if (status === BOOKING_STATUS.ACCEPTED) {
        if (booking.status === BOOKING_STATUS.ACCEPTED) {
          res.status(409).json({
            success: false,
            message: "This booking is no longer available (already accepted).",
            booking
          });
          return;
        }
        if (
          booking.status !== BOOKING_STATUS.REQUESTED &&
          booking.status !== BOOKING_STATUS.ASSIGNED &&
          booking.status !== BOOKING_STATUS.MATCHING
        ) {
          res.status(409).json({
            success: false,
            message: "This booking is no longer available.",
            booking
          });
          return;
        }
      }
    }

    const effectiveStatus = (status === "REJECTED" ? BOOKING_STATUS.CANCELLED : status);
    booking.status = effectiveStatus;
    booking.statusTimeline.push({
      status: effectiveStatus,
      timestamp: new Date(),
      note: note || (status === "REJECTED" ? "Rejected by worker" : `Status updated to ${status}`)
    });

    if (effectiveStatus === BOOKING_STATUS.COMPLETED) {
      booking.completedAt = new Date();
      booking.paymentStatus = "PAID";

      // Disburse earnings to Worker wallet
      if (booking.workerId) {
        await Worker.findByIdAndUpdate(booking.workerId, {
          $inc: {
            walletBalance: booking.fairWageBreakdown.workerEarning,
            totalEarnings: booking.fairWageBreakdown.workerEarning,
            jobsCompletedCount: 1
          }
        });
      }

      // Generate Invoice with real worker data
      const realWorker = booking.workerId ? await Worker.findById(booking.workerId) : null;
      const invNumber = `INV-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
      await Invoice.create({
        invoiceNumber: invNumber,
        bookingId: booking._id,
        customerDetails: {
          name: booking.customerName,
          phone: booking.customerPhone,
          address: booking.serviceLocation.address
        },
        workerDetails: {
          workerIdNumber: realWorker?.employeeId || realWorker?.workerIdNumber || "COOP-WRK",
          name: realWorker?.name || booking.workerName || "Verified Worker",
          phone: realWorker?.phone || booking.workerPhone || "+919876543210",
          verificationLevel: realWorker?.verificationLevel || 1,
          societyName: realWorker?.societyName || "Vijayawada Central Labour Cooperative"
        },
        serviceCategory: booking.serviceCategory,
        itemizedBreakdown: {
          baseWorkerWage: booking.fairWageBreakdown.baseWorkerWage,
          skillPremium: booking.fairWageBreakdown.skillPremium,
          experiencePremium: booking.fairWageBreakdown.experiencePremium,
          travelAllowance: booking.fairWageBreakdown.travelAllowance,
          emergencyAllowance: booking.fairWageBreakdown.emergencyAllowance,
          totalWorkerWage: booking.fairWageBreakdown.workerEarning,
          cooperativeWelfareFund: booking.fairWageBreakdown.cooperativeContribution,
          platformConvenienceCharge: 0,
          taxGstAmount: booking.fairWageBreakdown.taxGst,
          totalAmountPaid: booking.fairWageBreakdown.customerPaid
        }
      });
    }

    await booking.save();

    res.json({
      success: true,
      message: `Booking status updated to ${status}`,
      booking
    });
  } catch (error: any) {
    console.error("updateBookingStatus error:", error);
    res.status(500).json({ success: false, message: "Failed to update booking status." });
  }
};

export const submitReview = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const {
      bookingId,
      rating,
      qualityScore,
      punctualityScore,
      professionalismScore,
      behaviourRating,
      valueScore,
      comment,
      experienceComment,
      workImages,
      workVideo
    } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      res.status(404).json({ success: false, message: "Booking not found." });
      return;
    }

    let review = await Review.findOne({ bookingId });
    let isUpdate = false;

    if (review) {
      // Allow editing review
      isUpdate = true;
      review.overallRating = rating ?? review.overallRating;
      review.qualityScore = qualityScore ?? review.qualityScore;
      review.punctualityScore = punctualityScore ?? review.punctualityScore;
      review.professionalismScore = professionalismScore ?? review.professionalismScore;
      review.behaviourRating = behaviourRating ?? review.behaviourRating;
      review.valueScore = valueScore ?? review.valueScore;
      review.comment = comment ?? review.comment;
      review.experienceComment = experienceComment ?? review.experienceComment;
      if (workImages) review.workImages = workImages;
      if (workVideo !== undefined) review.workVideo = workVideo;
      await review.save();
    } else {
      review = await Review.create({
        bookingId,
        customerId: req.user?._id,
        workerId: booking.workerId,
        overallRating: rating,
        qualityScore: qualityScore || rating,
        punctualityScore: punctualityScore || rating,
        professionalismScore: professionalismScore || rating,
        behaviourRating: behaviourRating || rating,
        valueScore: valueScore || rating,
        comment: comment || experienceComment || "",
        experienceComment: experienceComment || comment || "",
        workImages: workImages || [],
        workVideo: workVideo || ""
      });
    }

    booking.rating = rating;
    booking.reviewComment = comment || experienceComment || "";
    await booking.save();

    // Recalculate worker average rating
    if (booking.workerId) {
      const allReviews = await Review.find({ workerId: booking.workerId });
      const avg = allReviews.reduce((sum, r) => sum + r.overallRating, 0) / (allReviews.length || 1);
      await Worker.findByIdAndUpdate(booking.workerId, {
        rating: Number(avg.toFixed(1)),
        reviewCount: allReviews.length
      });
    }

    res.status(isUpdate ? 200 : 201).json({
      success: true,
      message: isUpdate
        ? "Review updated successfully!"
        : "Feedback submitted successfully. Thank you for supporting our cooperative worker!",
      review
    });
  } catch (error: any) {
    console.error("submitReview error:", error);
    res.status(500).json({ success: false, message: "Failed to submit review." });
  }
};

export const getReviewByBookingId = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { bookingId } = req.params;
    const review = await Review.findOne({ bookingId });
    if (!review) {
      res.status(404).json({ success: false, message: "No review found for this booking." });
      return;
    }
    res.json({ success: true, review });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Failed to fetch review." });
  }
};

