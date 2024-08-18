import bcrypt from "bcrypt";
import { Router } from "express";
import { User } from "../database/models/User";

export const loginRouter = Router();

loginRouter.post("/", async (req, res) => {
  const { id, password } = req.body;
  if (typeof id !== "string" || typeof password !== "string") {
    res.status(400).end();
    return;
  }

  if (User.validateId(id) !== null) {
    res.status(401).end();
    return;
  }

  const user = await User.findOne({ where: { id } });
  if (!user) {
    res.status(401).end();
    return;
  }

  if (User.validatePassword(password) !== null) {
    res.status(401).end();
    return;
  }

  if (!(await bcrypt.compare(password, user.password.toString()))) {
    res.status(401).end();
    return;
  }

  req.session.user = {
    uid: user.uid,
    uuid: user.uuid,
    name: user.name,
    isAdmin: user.isAdmin,
    createdAt: user.createdAt,
  };

  res.status(201).end();
});
