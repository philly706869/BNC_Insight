import bcrypt from "bcrypt";
import { Router } from "express";
import { body, validationResult } from "express-validator";
import { User } from "../model/User.js";

export const logRouter = Router();

logRouter.put(
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
  async (req, res) => {
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
      res.status(400).end();
      return;
    }

    const { id, password }: { [key: string]: string } = req.body;

    const user = (await User.findOne({
      attributes: ["uid", "password", "isAdmin"],
      where: { id },
    }))!;

    const isCorrectPassword = bcrypt.compareSync(password, user.password);

    if (!isCorrectPassword) {
      res.status(400).end();
      return;
    }

    req.session.user = {
      uid: user.uid,
      isAdmin: user.isAdmin,
    };

    res.status(201).end();
  }
);

logRouter.delete("/", (req, res) => {
  req.session.destroy((error) => {
    if (error) res.status(500).end();
    else res.status(201).end();
  });
});
