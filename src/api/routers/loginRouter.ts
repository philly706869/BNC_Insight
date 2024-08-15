import bcrypt from "bcrypt";
import { Router } from "express";
import { User } from "../database/models/User";

export const loginRouter = Router();

loginRouter.post("/", async (req, res) => {
  const id = String(req.body.id);
  const password = String(req.body.password);

  const user = await User.findOne({ where: { id } });
  if (!user) {
    res.status(401).end();
    return;
  }

  if (!bcrypt.compareSync(password, user.password)) {
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
