import express from "express";
import { body } from "express-validator";
import { User } from "../../model/sequelize.js";
import { validate } from "../validator.js";

export const password = express.Router();

password.post("/", body("password").isString(), validate, async (req, res) => {
  const password: string = req.body.password;

  const validationResult = User.validatePassword(password);
  const valid = validationResult === null;
  const message = validationResult || [];

  res.status(200).json({
    validation: {
      valid,
      message,
    },
  });
});
