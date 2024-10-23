import { NextFunction, Request, Response } from "express";

export function authVerifier(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (!req.session.userUid) {
    res.status(401).json({
      errorCode: "UNAUTHORIZED_REQUEST",
      message: "Access denied. Please login to continue.",
    });
    return;
  }
  next();
}
