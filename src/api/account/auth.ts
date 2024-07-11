import { Router } from "express";
import { AuthToken } from "../../model/AuthToken.js";
import { User } from "../../model/User.js";
import { validationHandler } from "../validationHandler.js";
import { valueValidator } from "../valueValidator.js";

export const authRouter = Router();

authRouter.post(
  "/token",
  valueValidator,
  validationHandler,
  async (req, res) => {
    const value: string = req.body.value;
    const valid = (await AuthToken.findIfAllocable(value)) !== null;
    res.status(200).json({ valid });
  }
);

authRouter.post("/id", valueValidator, validationHandler, async (req, res) => {
  const value: string = req.body.value;
  const validation = User.validateId(value);
  const valid = validation === null;
  const exists = valid && (await User.findUserById(value)) !== null;
  const messages = validation || [];
  res.status(200).json({ valid, exists, messages });
});

authRouter.post(
  "/password",
  valueValidator,
  validationHandler,
  async (req, res) => {
    const value: string = req.body.value;
    const validation = User.validatePassword(value);
    const valid = validation === null;
    const messages = validation || [];
    res.status(200).json({ valid, messages });
  }
);

authRouter.post(
  "/name",
  valueValidator,
  validationHandler,
  async (req, res) => {
    const value: string = req.body.value;
    const validation = User.validateName(value);
    const valid = validation === null;
    const messages = validation || [];
    res.status(200).json({ valid, messages });
  }
);
