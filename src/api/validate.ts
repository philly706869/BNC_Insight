import express, { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { AuthToken } from "../model/AuthToken.js";
import { User } from "../model/User.js";

export const validate = express.Router();

const validator = (req: Request, res: Response, next: NextFunction) => {
  const validation = validationResult(req);
  if (validation.isEmpty()) {
    next();
    return;
  }

  res.status(400).json({ error: validation.array()[0].msg });
};

validate.post(
  "/token",
  body("token").isString().withMessage("token must be string."),
  validator,
  async (req, res) => {
    const { token }: { token: string } = req.body;

    res.status(200).json({ valid: await AuthToken.isAllocable(token) });
  }
);

validate.post(
  "/id",
  body("id").isString().withMessage("id must be string"),
  validator,
  async (req, res) => {
    const { id }: { id: string } = req.body;

    const validationResult = User.validateId(id);
    const valid = validationResult === null;
    const messages = validationResult || [];
    const exists = valid && (await User.findUserById(id)) !== null;

    res.status(200).json({
      valid,
      messages,
      exists,
    });
  }
);

validate.post(
  "/password",
  body("password").isString().withMessage("password must be string."),
  validator,
  async (req, res) => {
    const { password }: { password: string } = req.body;

    const validationResult = User.validatePassword(password);
    const valid = validationResult === null;
    const messages = validationResult || [];

    res.status(200).json({
      valid,
      messages,
    });
  }
);

validate.post(
  "/name",
  body("name").isString().withMessage("name must be string."),
  validator,
  async (req, res) => {
    const { name }: { name: string } = req.body;

    const validationResult = User.validateName(name);
    const valid = validationResult === null;
    const messages = validationResult || [];

    res.status(200).json({
      valid,
      messages,
    });
  }
);
