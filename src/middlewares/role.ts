import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth";

export const isAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
    console.log("user role", req.user)
  if (req.user?.role !== "ADMIN") {
    return res.status(403).json({ message: "Only admins can access this route" });
  }
  next();
};
