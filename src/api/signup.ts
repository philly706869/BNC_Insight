import express from "express";
import {
  body,
  FieldValidationError,
  validationResult,
} from "express-validator";
import {
  isAllocableToken,
  checkUserById,
  isValidUserPassword,
  isValidUserId,
  isValidUserName,
  User,
  AuthToken,
} from "../model-/sequelize.js";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

export const signup = express.Router();

signup.get("/auth/token", async (req, res) => {
  if (!req.query.value) {
    res.status(400).json({ error: "token must be string" });
    return;
  }

  res
    .status(200)
    .json({ valid: await isAllocableToken(req.query.value as string) });
});

signup.get("/auth/id", async (req, res) => {
  if (!req.query.value) {
    res.status(400).json({ error: "id must be string" });
    return;
  }

  res
    .status(200)
    .json({ valid: await checkUserById(req.query.value as string, true) });
});

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
    .custom((id: string) => isValidUserId(id))
    .withMessage("invalid id")
    .bail()
    .custom(async (id: string) =>
      (await checkUserById(id, false)) ? Promise.reject() : Promise.resolve()
    )
    .withMessage("id is already used"),
  body("password")
    .isString()
    .withMessage("password must be string")
    .custom((password: string) => isValidUserPassword(password))
    .withMessage("invalid password"),
  body("name")
    .isString()
    .withMessage("name must be string")
    .custom((name: string, { req }) => isValidUserName(name))
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
