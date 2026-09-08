import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User, IUser } from "../models/User";
import { UserRole } from "../config/constants";

export interface AuthenticatedRequest extends Request {
  user?: IUser & { role: UserRole };
}

export const authenticateJwt = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ success: false, message: "Authorization token missing or invalid." });
      return;
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET || "sahakari_seva_super_secure_jwt_secret_2026_sih";
    const decoded = jwt.verify(token, secret) as { userId: string; role: UserRole };

    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      res.status(401).json({ success: false, message: "User account not found or deactivated." });
      return;
    }

    req.user = user as IUser & { role: UserRole };
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid or expired authorization token." });
  }
};

