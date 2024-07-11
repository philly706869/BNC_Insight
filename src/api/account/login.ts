import bcrypt from "bcrypt";
import { Router } from "express";
import Joi from "joi";
import { User } from "../../model/User.js";

export const loginRouter = Router();

const bodySchema = Joi.object<{
  id: string;
  password: string;
}>({
  id: Joi.string()
    .custom((value: string) => {
      return User.validateId(value) === null;
    })
    .required(),
  password: Joi.string()
    .custom((value: string) => {
      return User.validatePassword(value) === null;
    })
    .required(),
}).unknown(true);

loginRouter.post("/", async (req, res) => {
  const validation = bodySchema.validate(req.body);
  if (validation.error) {
    res.status(400).end();
    return;
  }
  const { id, password } = validation.value;

  const user = await User.findUserById(id);

  if (user === null) {
    res.status(401).end();
    return;
  }

  if (!bcrypt.compareSync(password, user.password)) {
    res.status(401).end();
    return;
  }

  req.session.user = {
    uid: user.uid,
    isAdmin: user.isAdmin,
  };

  res.status(201).end();
});
