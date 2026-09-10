import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User, IUser } from "../models/User";
import { Admin } from "../models/Admin";
import { UserRole, USER_ROLES } from "../config/constants";

export interface AuthenticatedRequest extends Request {
  user?: (IUser & { role: UserRole }) | any;
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
    const primarySecret = process.env.JWT_SECRET || "super_secret_coopnex_production_jwt_key_2026";
    let decoded: any;
    try {
      decoded = jwt.verify(token, primarySecret) as { userId: string; role: UserRole; adminId?: string };
    } catch {
      decoded = jwt.verify(token, "sahakari_seva_super_secure_jwt_secret_2026_sih") as { userId: string; role: UserRole; adminId?: string };
    }

    let user: any = null;
    if (decoded.role === USER_ROLES.SUPER_ADMIN || decoded.adminId) {
      try {
        const admin = await Admin.findById(decoded.userId) || await Admin.findOne({ adminId: decoded.adminId });
        if (admin && admin.status === "ACTIVE") {
          user = {
            _id: admin._id,
            id: admin._id,
            name: admin.name,
            email: admin.email,
            role: USER_ROLES.SUPER_ADMIN,
            isActive: true
          };
        }
      } catch (err) {
        console.error("Admin lookup error in authenticateJwt:", err);
      }
    }

    if (!user) {
      try {
        user = await User.findById(decoded.userId);
      } catch (err) {
        console.error("User lookup error in authenticateJwt:", err);
      }
    }

    if (!user || !user.isActive) {
      res.status(401).json({ success: false, message: "User account not found or deactivated." });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("authenticateJwt error:", error);
    res.status(401).json({ success: false, message: "Invalid or expired authorization token." });
  }
};

