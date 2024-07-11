import { Router } from "express";
import Joi from "joi";
import { AuthToken } from "../../model/AuthToken.js";
import { User } from "../../model/User.js";

export const authRouter = Router();

const bodySchema = Joi.object<{ value: string }>({
  value: Joi.string().allow("").required(),
});

authRouter.post("/token", async (req, res) => {
  const validation = bodySchema.validate(req.body);
  if (validation.error) {
    res.status(400).end();
    return;
  }
  const { value } = validation.value;
  const valid = (await AuthToken.findIfAllocable(value)) !== null;
  res.status(200).json({ valid });
});

authRouter.post("/id", async (req, res) => {
  const validation = bodySchema.validate(req.body);
  if (validation.error) {
    res.status(400).end();
    return;
  }
  const { value } = validation.value;
  const idValidation = User.validateId(value);
  const valid = idValidation === null;
  const exists = valid && (await User.findUserById(value)) !== null;
  const messages = idValidation || [];
  res.status(200).json({ valid, exists, messages });
});

authRouter.post("/password", async (req, res) => {
  const validation = bodySchema.validate(req.body);
  if (validation.error) {
    res.status(400).end();
    return;
  }
  const { value } = validation.value;
  const passwordValidation = User.validatePassword(value);
  const valid = passwordValidation === null;
  const messages = passwordValidation || [];
  res.status(200).json({ valid, messages });
});

authRouter.post("/name", async (req, res) => {
  const validation = bodySchema.validate(req.body);
  if (validation.error) {
    res.status(400).end();
    return;
  }
  const { value } = validation.value;
  const nameValidation = User.validateName(value);
  const valid = nameValidation === null;
  const messages = nameValidation || [];
  res.status(200).json({ valid, messages });
});
