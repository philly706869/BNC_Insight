import { Router } from "express";
import Joi from "joi";
import { AuthToken } from "../../model/AuthToken.js";
import { User } from "../../model/User.js";
import { logger } from "../../util/logger.js";

export const authRouter = Router();

const bodySchema = Joi.object<{ value: string }>({
  value: Joi.string().allow(``).required(),
}).unknown(true);

authRouter.post(`/token`, async (req, res) => {
  try {
    const { value } = await bodySchema.validateAsync(req.body);
    const authToken = await AuthToken.findOne({ where: { token: value } });
    const valid = authToken !== null && authToken.allocedUserUid === null;
    res.status(200).json({ valid });
  } catch (error) {
    if (Joi.isError(error)) res.status(400).end();
    else {
      logger.error(error);
      res.status(500).end();
    }
  }
});

authRouter.post(`/id`, async (req, res) => {
  try {
    const { value } = await bodySchema.validateAsync(req.body);
    const idValidation = User.validateId(value);
    const valid = idValidation === null;
    const exists =
      valid && (await User.findOne({ where: { id: value } })) !== null;
    const messages = idValidation || [];
    res.status(200).json({ valid, exists, messages });
  } catch (error) {
    if (Joi.isError(error)) res.status(400).end();
    else {
      logger.error(error);
      res.status(500).end();
    }
  }
});

authRouter.post(`/password`, async (req, res) => {
  try {
    const { value } = await bodySchema.validateAsync(req.body);
    const passwordValidation = User.validatePassword(value);
    const valid = passwordValidation === null;
    const messages = passwordValidation || [];
    res.status(200).json({ valid, messages });
  } catch (error) {
    if (Joi.isError(error)) res.status(400).end();
    else {
      logger.error(error);
      res.status(500).end();
    }
  }
});

authRouter.post(`/name`, async (req, res) => {
  try {
    const { value } = await bodySchema.validateAsync(req.body);
    const nameValidation = User.validateName(value);
    const valid = nameValidation === null;
    const messages = nameValidation || [];
    res.status(200).json({ valid, messages });
  } catch (error) {
    if (Joi.isError(error)) res.status(400).end();
    else {
      logger.error(error);
      res.status(500).end();
    }
  }
});
