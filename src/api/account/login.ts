import bcrypt from "bcrypt";
import { Router } from "express";
import Joi from "joi";
import { User } from "../../model/User.js";

export const loginRouter = Router();

const bodySchema = Joi.object<{ id: string; password: string }>({
  id: Joi.string().required(),
  password: Joi.string().required(),
});

loginRouter.post("/", async (req, res) => {
  const validation = bodySchema.validate(req.body);
  if (validation.error) {
    res.status(400).error({ errors: [{ error: "", message: "" }] });
    return;
  }

  const { id, password } = validation.value;

  if (User.validateId(id) !== null) {
    res.status(400).error({ errors: [{ error: "", message: "" }] });
    return;
  }

  if (User.validatePassword(password) !== null) {
    res.status(400).error({ errors: [{ error: "", message: "" }] });
    return;
  }

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
});
