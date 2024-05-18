import { Request, Response } from "express";
import { body, oneOf, validationResult } from "express-validator";

export default [
  body("email").isString().optional(),
  body("authToken").isString().optional(),
  (req: Request, res: Response) => {
    res.status(200).json(validationResult(req));
  },
];
