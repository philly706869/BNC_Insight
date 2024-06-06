import bcrypt from "bcrypt";
import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { User } from "../model/User.js";

export const login = express.Router();

login.post(
  "/",
  body("id")
    .isString()
    .bail()
    .custom(async (id: string) =>
      User.validateId(id) === null && (await User.findUserById(id)) !== null
        ? Promise.resolve()
        : Promise.reject()
    ),
  body("password")
    .isString()
    .bail()
    .custom((password: string) => User.validatePassword(password) === null),
  async (req: Request, res: Response) => {
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
      res.status(400).end();
      return;
    }

    const { id, password }: { [key: string]: string } = req.body;

    const user = (await User.findOne({
      attributes: ["uid", "password"],
      where: { id },
    }))!;

    const isCorrectPassword = bcrypt.compareSync(password, user.password);

    if (!isCorrectPassword) {
      res.status(400).end();
      return;
    }

    req.session.userUid = user.uid;

    res.status(201).end();
  }
);
