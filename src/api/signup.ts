import express from "express";
import {
  body,
  FieldValidationError,
  validationResult,
} from "express-validator";
import {
  isAllocableToken,
  checkUserById,
  validateUserPassword,
  validateUserId,
  validateUserName,
  User,
  AuthToken,
} from "../model/sequelize.js";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { authToken } from "./signup/auth/token.js";
import { authId } from "./signup/auth/id.js";

export const signup = express.Router();

signup.use("/auth/token", authToken);
signup.use("/auth/id", authId);

signup.post(
  "/",
  body("authToken")
    .isString()
    .withMessage("authToken must be string")
    .bail()
    .custom(async (token: string) =>
      (await isAllocableToken(token)) ? Promise.resolve() : Promise.reject()
    )
    .withMessage("invalid token"),
  body("id")
    .isString()
    .withMessage("id must be string")
    .bail()
    .custom((id: string) => validateUserId(id) !== null)
    .withMessage("invalid id")
    .bail()
    .custom(async (id: string) =>
      (await checkUserById(id, false)) ? Promise.reject() : Promise.resolve()
    )
    .withMessage("id is already used"),
  body("password")
    .isString()
    .withMessage("password must be string")
    .custom((password: string) => validateUserPassword(password) === null)
    .withMessage("invalid password"),
  body("name")
    .isString()
    .withMessage("name must be string")
    .custom((name: string, { req }) => validateUserName(name) !== null)
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
