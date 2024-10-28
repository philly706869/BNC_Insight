import { RequestHandler } from "express";

export const authVerifier: RequestHandler = (req, res, next): void => {
  if (req.session.userUid === undefined) {
    res.status(401).json({
      errorCode: "UNAUTHORIZED_REQUEST",
      message: "Access denied. Please login to continue.",
    });
    return;
  }
  next();
};
