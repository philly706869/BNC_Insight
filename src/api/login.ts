import { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import {
  checkUserById,
  validateUserPassword,
  User,
} from "../model/sequelize.js";
import express from "express";
import bcrypt from "bcrypt";

export const login = express.Router();

login.post(
  "/",
  body("id")
    .isString()
    .bail()
    .custom(async (id: string) =>
      (await checkUserById(id, true)) ? Promise.resolve() : Promise.reject()
    ),
  body("password")
    .isString()
    .bail()
    .custom((password: string) => validateUserPassword(password) === null),
  async (req: Request, res: Response) => {
    const validation = validationResult(req);

    if (!validation.isEmpty()) {
      res.status(400).end();
      return;
    }

    const user = (await User.findOne({
      attributes: ["uid", "password"],
      where: { id: req.body.id },
    }))!;

    const isCorrectPassword = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!isCorrectPassword) {
      res.status(400).end();
      return;
    }

    req.session.userUid = user.uid;

    res.status(201).redirect("/");
  }
);
