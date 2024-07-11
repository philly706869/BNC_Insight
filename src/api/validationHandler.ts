import { RequestHandler } from "express";
import { validationResult } from "express-validator";

export const validationHandler: RequestHandler = (req, res, next) => {
  const validation = validationResult(req);
  if (validation.isEmpty()) {
    next();
    return;
  }
  const errors = validation.array().map((error) => error.msg);
  res.status(400).json({ errors });
};
