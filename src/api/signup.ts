import bcrypt from "bcrypt";
import express from "express";
import { AuthToken, User } from "../model/sequelize.js";
import { v4 as uuidv4 } from "uuid";
import {
  FieldValidationError,
  body,
  validationResult,
} from "express-validator";

export const signup = express.Router();

signup.post(
  "/",
  body("authToken")
    .isString()
    .withMessage("authToken must be string")
    .bail()
    .custom(async (token: string) =>
      (await AuthToken.isAllocable(token))
        ? Promise.resolve()
        : Promise.reject()
    )
    .withMessage("invalid token"),
  body("id")
    .isString()
    .withMessage("id must be string")
    .bail()
    .custom((id: string) => User.validateId(id) !== null)
    .withMessage("invalid id")
    .bail()
    .custom(async (id: string) =>
      User.validateId(id) === null && (await User.findUserById(id)) === null
        ? Promise.resolve()
        : Promise.reject()
    )
    .withMessage("id is already used"),
  body("password")
    .isString()
    .withMessage("password must be string")
    .custom((password: string) => User.validatePassword(password) === null)
    .withMessage("invalid password"),
  body("name")
    .isString()
    .withMessage("name must be string")
    .custom((name: string, { req }) => User.validateName(name) !== null)
    .withMessage("invalid name"),
  async (req, res) => {
    const validation = validationResult(req);

    if (!validation.isEmpty()) {
      res.status(400).json({
        error: (validation.array() as FieldValidationError[]).reduce(
          (errors, error) => ({ ...errors, [error.path]: error.msg }),
          {}
        ),
      });
      return;
    }

    const token = (await AuthToken.findOne({
      attributes: ["uid", "isAdminToken"],
      where: { token: req.body.authToken },
    }))!;

    const user = new User({
      uuid: uuidv4(),
      tokenUid: token.uid,
      id: req.body.id,
      password: bcrypt.hashSync(req.body.password, 10),
      name: req.body.name,
      isAdmin: token.isAdminToken,
    });
    await user.save();

    token.allocedUserUid = user.uid;

    await token.save();

    req.session.userUid = user.uid;

    res.status(201).end();
  }
);
