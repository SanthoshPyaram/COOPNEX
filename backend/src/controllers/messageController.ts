import { Response } from "express";
import mongoose from "mongoose";
import { Message } from "../models/Message";
import { Booking } from "../models/Booking";
import { Worker } from "../models/Worker";
import { AuthenticatedRequest } from "../middleware/auth";

export const getMessagesByBooking = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { bookingId } = req.params;
    const userId = req.user?._id;

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      res.status(400).json({ success: false, message: "Invalid booking ID." });
      return;
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      res.status(404).json({ success: false, message: "Booking not found." });
      return;
    }

    // Authorization: User must be customer, assigned worker, or an admin
    const isCustomer = booking.customerId.toString() === userId?.toString();
    const isWorker = booking.workerId?.toString() === userId?.toString();
    const isAdmin = ["SUPER_ADMIN", "FEDERATION_ADMIN", "SOCIETY_ADMIN"].includes(req.user?.role || "");

    // Also check worker by userId
    let isWorkerByUser = false;
    if (!isWorker && !isCustomer && !isAdmin && booking.workerId) {
      const workerDoc = await Worker.findOne({ _id: booking.workerId, userId });
      isWorkerByUser = Boolean(workerDoc);
    }

    if (!isCustomer && !isWorker && !isWorkerByUser && !isAdmin) {
      res.status(403).json({ success: false, message: "Unauthorized to access messages for this booking." });
      return;
    }

    const messages = await Message.find({ bookingId }).sort({ timestamp: 1 }).lean();

    res.json({
      success: true,
      booking: {
        id: booking._id,
        bookingNumber: booking.bookingNumber,
        serviceCategory: booking.serviceCategory,
        customerName: booking.customerName,
        workerName: booking.workerName,
        status: booking.status
      },
      messages
    });
  } catch (error: any) {
    console.error("getMessagesByBooking error:", error);
    res.status(500).json({ success: false, message: "Failed to retrieve messages." });
  }
};

export const sendMessage = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { bookingId } = req.params;
    const { text } = req.body;
    const user = req.user;

    if (!text || !text.trim()) {
      res.status(400).json({ success: false, message: "Message content cannot be empty." });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      res.status(400).json({ success: false, message: "Invalid booking ID." });
      return;
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      res.status(404).json({ success: false, message: "Booking not found." });
      return;
    }

    const isCustomer = booking.customerId.toString() === user?._id?.toString();
    let isWorker = booking.workerId?.toString() === user?._id?.toString();

    if (!isWorker && booking.workerId) {
      const workerDoc = await Worker.findOne({ _id: booking.workerId, userId: user?._id });
      isWorker = Boolean(workerDoc);
    }

    const isAdmin = ["SUPER_ADMIN", "FEDERATION_ADMIN", "SOCIETY_ADMIN"].includes(user?.role || "");

    if (!isCustomer && !isWorker && !isAdmin) {
      res.status(403).json({ success: false, message: "Unauthorized to send messages in this booking." });
      return;
    }

    let senderRole: "CUSTOMER" | "WORKER" | "ADMIN" = "CUSTOMER";
    let recipientId: mongoose.Types.ObjectId | undefined;
    let recipientRole: string | undefined;

    if (isAdmin) {
      senderRole = "ADMIN";
    } else if (isWorker) {
      senderRole = "WORKER";
      recipientId = booking.customerId;
      recipientRole = "CUSTOMER";
    } else {
      senderRole = "CUSTOMER";
      if (booking.workerId) {
        recipientId = booking.workerId;
        recipientRole = "WORKER";
      }
    }

    const newMsg = await Message.create({
      bookingId: booking._id,
      senderId: user?._id,
      senderRole,
      senderName: user?.name || "Participant",
      recipientId,
      recipientRole,
      text: text.trim(),
      readStatus: false,
      timestamp: new Date()
    });

    res.json({
      success: true,
      message: newMsg
    });
  } catch (error: any) {
    console.error("sendMessage error:", error);
    res.status(500).json({ success: false, message: "Failed to send message." });
  }
};

export const getAllBookingConversations = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const recentMessages = await Message.find()
      .sort({ timestamp: -1 })
      .limit(100)
      .populate("bookingId", "bookingNumber customerName workerName serviceCategory status")
      .lean();

    res.json({
      success: true,
      messages: recentMessages
    });
  } catch (error: any) {
    console.error("getAllBookingConversations error:", error);
    res.status(500).json({ success: false, message: "Failed to retrieve conversation audit." });
  }
};

