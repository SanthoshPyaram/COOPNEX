import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./auth";
import { UserRole } from "../config/constants";

export const requireRoles = (...allowedRoles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Authentication required." });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Forbidden: User role '${req.user.role}' lacks permission for this resource. Required: [${allowedRoles.join(", ")}]`
      });
      return;
    }

    next();
  };
};

