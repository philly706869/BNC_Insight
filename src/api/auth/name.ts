import express from "express";
import { body } from "express-validator";
import { User } from "../../model/sequelize.js";
import { validate } from "../validator.js";

export const name = express.Router();

name.post("/", body("name").isString(), validate, async (req, res) => {
  const name: string = req.body.name;

  const validationResult = User.validateName(name);
  const valid = validationResult === null;
  const message = validationResult || [];

  res.status(200).json({
    validation: {
      valid,
      message,
    },
  });
});
