import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import { Notification, NotificationType } from "../models/Notification";

export const getNotifications = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized." });
      return;
    }

    let notifications = await Notification.find({ userId }).sort({ createdAt: -1 }).limit(20);

    // If new user has no notifications, create genuine welcome notifications
    if (notifications.length === 0) {
      const initial = [
        {
          userId,
          title: "Welcome to COOPNEX Citizen Portal",
          message: "Your citizen account is verified. Access 22 state-certified cooperative technicians across Vijayawada with direct fair wage pricing.",
          type: "SYSTEM" as NotificationType,
          read: false,
          createdAt: new Date()
        },
        {
          userId,
          title: "Zero Commission Guarantee",
          message: "100% of your booking payment reaches the artisan's cooperative account with statutory PMSBY safety coverage.",
          type: "SYSTEM" as NotificationType,
          read: false,
          createdAt: new Date(Date.now() - 3600000)
        }
      ];
      await Notification.insertMany(initial);
      notifications = await Notification.find({ userId }).sort({ createdAt: -1 }).limit(20);
    }

    const unreadCount = notifications.filter((n) => !n.read).length;

    res.json({
      success: true,
      count: notifications.length,
      unreadCount,
      notifications
    });
  } catch (error: any) {
    console.error("getNotifications error:", error);
    res.status(500).json({ success: false, message: "Failed to load notifications." });
  }
};

export const markAsRead = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    const { id } = req.params;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId },
      { $set: { read: true } },
      { new: true }
    );

    if (!notification) {
      res.status(404).json({ success: false, message: "Notification not found." });
      return;
    }

    res.json({ success: true, notification });
  } catch (error: any) {
    console.error("markAsRead error:", error);
    res.status(500).json({ success: false, message: "Failed to update notification." });
  }
};

export const markAllAsRead = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    await Notification.updateMany({ userId, read: false }, { $set: { read: true } });

    res.json({ success: true, message: "All notifications marked as read." });
  } catch (error: any) {
    console.error("markAllAsRead error:", error);
    res.status(500).json({ success: false, message: "Failed to mark notifications as read." });
  }
};
