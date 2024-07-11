import bcrypt from "bcrypt";
import { Router } from "express";
import { body } from "express-validator";
import Joi from "joi";
import { User } from "../../model/User.js";

export const loginRouter = Router();

const schema = Joi.object<{
  id: string;
  password: string;
}>({
  id: Joi.string()
    .custom(() => {})
    .required(),
  password: Joi.string().required(),
});

loginRouter.post(
  "/",
  body("id")
    .exists()
    .withMessage({
      error: "ID_NOT_PROVIDED",
      message: "You must provide `id`.",
    })
    .bail()
    .isString()
    .withMessage({ error: "INVALID_ID_TYPE", message: "`id` must be string." })
    .custom(async (value: string) => {
      if (User.validatePassword(value) !== null)
        throw {
          error: "INCORRECT_ID",
          message: "`id` is not correct.",
        };
    }),
  body("password")
    .exists()
    .withMessage({
      error: "PASSWORD_NOT_PROVIDED",
      message: "You must provide `password`.",
    })
    .bail()
    .isString()
    .withMessage({
      error: "INVALID_PASSWORD_TYPE",
      message: "`password` must be string.",
    })
    .custom(async (value: string) => {
      if (User.validatePassword(value) !== null)
        throw {
          error: "INCORRECT_PASSWORD",
          message: "`password` is not correct.",
        };
    }),
  async (req, res) => {
    const { id, password }: { id: string; password: string } = req.body;

    const user = await User.findUserById(id);

    if (user === null) {
      res.status(400).error({ errors: [{ error: "", message: "" }] });
      return;
    }

    if (!bcrypt.compareSync(password, user.password)) {
      res.status(400).error({ errors: [{ error: "", message: "" }] });
      return;
    }

    req.session.user = {
      uid: user.uid,
      isAdmin: user.isAdmin,
    };

    res.status(201).end();
  }
);
