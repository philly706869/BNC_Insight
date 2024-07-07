import { NextFunction, Request, Response, Router } from "express";
import { body, validationResult } from "express-validator";
import { AuthToken } from "../model/AuthToken.js";
import { User } from "../model/User.js";

export const validate = Router();

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
    const token: string = req.body.token;

    res.status(200).json({ valid: await AuthToken.isAllocable(token) });
  }
);

validate.post(
  "/id",
  body("id").isString().withMessage("id must be string"),
  validator,
  async (req, res) => {
    const id: string = req.body.id;

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
    const password: string = req.body.password;

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
    const name: string = req.body.name;

    const validationResult = User.validateName(name);
    const valid = validationResult === null;
    const messages = validationResult || [];

    res.status(200).json({
      valid,
      messages,
    });
  }
);
