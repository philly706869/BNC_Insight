import bcrypt from "bcrypt";
import { Router } from "express";
import { body, validationResult } from "express-validator";
import { v4 as uuidv4 } from "uuid";
import { AuthToken } from "../model/AuthToken.js";
import { User } from "../model/User.js";
import { logRouter } from "./log.js";

export const userRouter = Router();

userRouter.use("/log", logRouter);

userRouter.post(
  "/",
  body("authToken")
    .isString()
    .bail()
    .custom(async (token: string) =>
      (await AuthToken.isAllocable(token))
        ? Promise.resolve()
        : Promise.reject()
    ),
  body("id")
    .isString()
    .bail()
    .custom(async (id: string) =>
      User.validateId(id) === null && (await User.findUserById(id)) === null
        ? Promise.resolve()
        : Promise.reject()
    ),
  body("password")
    .isString()
    .custom((password: string) => User.validatePassword(password) === null),
  body("name")
    .isString()
    .custom((name: string) => User.validateName(name) === null),
  async (req, res) => {
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
      res.status(400).end();
      return;
    }

    const { authToken, id, password, name }: { [key: string]: string } =
      req.body;

    const token = (await AuthToken.findOne({
      attributes: ["uid", "isAdminToken"],
      where: { token: authToken },
    }))!;

    const user = new User({
      uuid: uuidv4(),
      tokenUid: token.uid,
      id,
      password: bcrypt.hashSync(password, 10),
      name,
      isAdmin: token.isAdminToken,
    });
    await user.save();

    token.allocedUserUid = user.uid;

    await token.save();

    res.status(201).end();
  }
);

userRouter.patch("/", (req, res) => {
  res.end();
});

userRouter.delete("/", async (req, res) => {
  res.end();
});
