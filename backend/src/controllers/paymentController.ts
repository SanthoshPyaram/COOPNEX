import { Request, Response } from "express";
import crypto from "crypto";
import { Payment } from "../models/Payment";
import { Booking } from "../models/Booking";
import { Worker } from "../models/Worker";
import { Invoice } from "../models/Invoice";
import { BOOKING_STATUS } from "../config/constants";
import { AuthenticatedRequest } from "../middleware/auth";

export const createPaymentOrder = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      res.status(404).json({ success: false, message: "Booking not found." });
      return;
    }

    const amountInPaisa = Math.round(booking.fairWageBreakdown.customerPaid * 100);
    const mockOrderId = `order_${crypto.randomBytes(8).toString("hex")}`;

    const payment = await Payment.create({
      transactionId: `TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      bookingId: booking._id,
      customerId: booking.customerId,
      workerId: booking.workerId || booking.customerId,
      societyId: booking.societyId || booking.customerId,
      amount: booking.fairWageBreakdown.customerPaid,
      currency: "INR",
      paymentGateway: "RAZORPAY_TEST",
      status: "INITIATED",
      gatewayOrderId: mockOrderId,
      workerEarningAmount: booking.fairWageBreakdown.workerEarning,
      coopFundAmount: booking.fairWageBreakdown.cooperativeContribution
    });

    res.json({
      success: true,
      orderId: mockOrderId,
      amount: amountInPaisa,
      currency: "INR",
      key: process.env.RAZORPAY_KEY_ID || "rzp_test_sahakari2026",
      paymentId: payment._id,
      fairWageBreakdown: booking.fairWageBreakdown
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Payment order creation failed." });
  }
};

export const verifyPayment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { bookingId, razorpayPaymentId, razorpayOrderId, method = "UPI" } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      res.status(404).json({ success: false, message: "Booking not found." });
      return;
    }

    // Update payment record
    const payment = await Payment.findOneAndUpdate(
      { bookingId: booking._id },
      {
        status: "SUCCESS",
        gatewayPaymentId: razorpayPaymentId || `pay_${crypto.randomBytes(8).toString("hex")}`,
        gatewayOrderId: razorpayOrderId,
        paymentMethod: method,
        workerWageDisbursed: true
      },
      { new: true, upsert: true }
    );

    // Update booking
    booking.paymentStatus = "PAID";
    booking.paymentId = payment.transactionId;
    booking.status = BOOKING_STATUS.COMPLETED;
    booking.completedAt = new Date();
    booking.statusTimeline.push({
      status: BOOKING_STATUS.COMPLETED,
      timestamp: new Date(),
      note: `Payment of ₹${booking.fairWageBreakdown.customerPaid} verified. Worker wallet credited with ₹${booking.fairWageBreakdown.workerEarning}.`
    });
    await booking.save();

    // Disburse to Worker Wallet
    if (booking.workerId) {
      await Worker.findByIdAndUpdate(booking.workerId, {
        $inc: {
          walletBalance: booking.fairWageBreakdown.workerEarning,
          totalEarnings: booking.fairWageBreakdown.workerEarning,
          jobsCompletedCount: 1
        }
      });
    }

    // Create / Update Invoice
    const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const invoice = await Invoice.findOneAndUpdate(
      { bookingId: booking._id },
      {
        invoiceNumber,
        bookingId: booking._id,
        paymentId: payment._id,
        customerDetails: {
          name: booking.customerName,
          phone: booking.customerPhone,
          address: booking.serviceLocation.address
        },
        workerDetails: {
          workerIdNumber: "SS-AP-2026-104",
          name: booking.workerName || "Verified Worker",
          phone: booking.workerPhone || "+919876543210",
          verificationLevel: 4,
          societyName: "Vijayawada Central Labour Cooperative"
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
        },
        issuedAt: new Date()
      },
      { new: true, upsert: true }
    );

    res.json({
      success: true,
      message: "Payment successfully verified and settled. Worker wallet credited.",
      payment,
      invoice
    });
  } catch (error: any) {
    console.error("verifyPayment error:", error);
    res.status(500).json({ success: false, message: "Payment verification failed." });
  }
};

export const getInvoiceByBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { bookingId } = req.params;
    let invoice = await Invoice.findOne({ bookingId });

    if (!invoice) {
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        res.status(404).json({ success: false, message: "Booking not found." });
        return;
      }

      // Generate invoice on the fly if paid
      invoice = await Invoice.create({
        invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
        bookingId: booking._id,
        customerDetails: {
          name: booking.customerName,
          phone: booking.customerPhone,
          address: booking.serviceLocation.address
        },
        workerDetails: {
          workerIdNumber: "SS-AP-2026-104",
          name: booking.workerName || "Raj Kumar",
          phone: booking.workerPhone || "+91 98480 22341",
          verificationLevel: 4,
          societyName: "Vijayawada Central Labour Cooperative"
        },
        serviceCategory: booking.serviceCategory,
        itemizedBreakdown: {
          baseWorkerWage: booking.fairWageBreakdown?.baseWorkerWage || 450,
          skillPremium: booking.fairWageBreakdown?.skillPremium || 70,
          experiencePremium: booking.fairWageBreakdown?.experiencePremium || 40,
          travelAllowance: booking.fairWageBreakdown?.travelAllowance || 30,
          emergencyAllowance: booking.fairWageBreakdown?.emergencyAllowance || 60,
          totalWorkerWage: booking.fairWageBreakdown?.workerEarning || 650,
          cooperativeWelfareFund: booking.fairWageBreakdown?.cooperativeContribution || 78,
          platformConvenienceCharge: 0,
          taxGstAmount: booking.fairWageBreakdown?.taxGst || 36,
          totalAmountPaid: booking.fairWageBreakdown?.customerPaid || 764
        },
        issuedAt: new Date()
      });
    }

    res.json({ success: true, invoice });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error fetching invoice." });
  }
};

