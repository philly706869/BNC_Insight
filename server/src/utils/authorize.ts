import { UnauthorizedRequestError } from "@/errors/controller-error";
import { NextFunction, Request, Response } from "express";

export function authorize(
  req: Request,
  res: Response,
  next: NextFunction
): number | undefined {
  const userUid = req.session.userUid;
  if (userUid === undefined) {
    next(new UnauthorizedRequestError());
    return;
  }
  return userUid;
}
