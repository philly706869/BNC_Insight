import { Request, Response } from "express";

export function authorize(req: Request, res: Response): number | undefined {
  const userUid = req.session.userUid;
  if (userUid === undefined) {
    res.status(401).json({
      errorCode: "UNAUTHORIZED_REQUEST",
      message: "Access denied. Please login to continue.",
    });
  }
  return userUid;
}
