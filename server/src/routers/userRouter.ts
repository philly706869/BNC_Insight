import {
  createUserController,
  deleteUserController,
  findUserController,
  updateUserController,
} from "@/controllers/userController";
import bcrypt from "bcrypt";
import { Router } from "express";
import { AuthToken } from "../models/AuthToken";
import { User } from "../models/User";

export const userRouter = Router();
userRouter.post("/", createUserController);
userRouter.get("/", findUserController);
userRouter.patch("/", updateUserController);
userRouter.delete("/", deleteUserController);

userRouter.post("/", async (req, res) => {
  const { authToken, id, password, name } = req.body;
  if (
    typeof authToken !== "string" ||
    typeof id !== "string" ||
    typeof password !== "string" ||
    typeof name !== "string"
  ) {
    res.status(400).end();
    return;
  }

  if (!AuthToken.validateToken(authToken)) {
    res.status(400).end();
    return;
  }

  const token = await AuthToken.findOne({
    where: { token: authToken },
    relations: { allocedUser: true },
  });
  if (!token || token.allocedUser !== null) {
    res.status(400).end();
    return;
  }

  if (User.validateId(id) !== null) {
    res.status(400).end();
    return;
  }

  if ((await User.findOne({ where: { id } })) !== null) {
    res.status(409).end();
    return;
  }

  if (User.validatePassword(password) !== null) {
    res.status(400).end();
    return;
  }

  if (User.validateName(name) !== null) {
    res.status(400).end();
    return;
  }

  const user = User.create({
    id,
    password: Buffer.from(await bcrypt.hash(password, 10)),
    name,
    isAdmin: token.isAdminToken,
  });

  token.allocedUser = user;

  await user.save();
  await token.save();

  res.status(201).end();
});
