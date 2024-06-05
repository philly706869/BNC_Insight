import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const validation = validationResult(req);

  if (validation.isEmpty()) {
    next();
    return;
  }

  const error = validation.array().map((error) => error.msg);

  res.status(400).json({ error });
};
