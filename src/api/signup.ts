import bcrypt from "bcrypt";
import express from "express";
import { body, validationResult } from "express-validator";
import { v4 as uuidv4 } from "uuid";
import { AuthToken } from "../model/AuthToken.js";
import { User } from "../model/User.js";

export const signup = express.Router();

signup.post(
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

    req.session.userUid = user.uid;

    res.status(201).end();
  }
);
