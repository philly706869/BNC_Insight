import { RequestHandler, Router } from "express";
import Joi from "joi";
import { AuthToken } from "../../model/AuthToken.js";
import { User } from "../../model/User.js";

export const authRouter = Router();

const bodySchema = Joi.object<{ value: string }>({
  value: Joi.string().required(),
});

function createValidateHandler(
  validator: (value: string) => any
): RequestHandler {
  return async (req, res) => {
    const validation = bodySchema.validate(req.body);
    if (validation.error) {
      res
        .status(400)
        .error({ errors: [{ error: "INVALID_BODY", message: "" }] });
      return;
    }

    const { value } = validation.value;
    const response = await validator(value);
    res.status(200).json(response);
  };
}

authRouter.post(
  "/token",
  createValidateHandler(async (value) => {
    const valid = await AuthToken.isAllocable(value);
    return { valid };
  })
);

authRouter.post(
  "/id",
  createValidateHandler(async (value) => {
    const validation = User.validateId(value);
    const valid = validation === null;
    const exists = valid && (await User.findUserById(value)) !== null;
    const messages = validation || [];
    return { valid, exists, messages };
  })
);

authRouter.post(
  "/password",
  createValidateHandler((value) => {
    const validation = User.validatePassword(value);
    const valid = validation === null;
    const messages = validation || [];
    return { valid, messages };
  })
);

authRouter.post(
  "/name",
  createValidateHandler((value) => {
    const validation = User.validateName(value);
    const valid = validation === null;
    const messages = validation || [];
    return { valid, messages };
  })
);
