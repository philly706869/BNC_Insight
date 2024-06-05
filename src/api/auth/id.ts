import express from "express";
import { body } from "express-validator";
import { User } from "../../model/sequelize.js";
import { validate } from "../validator.js";

export const id = express.Router();

id.post("/", body("id").isString(), validate, async (req, res) => {
  const id: string = req.body.id;

  const idValidation = User.validateId(id);
  const valid = idValidation === null && (await User.findUserById(id)) === null;

  switch (valid) {
    case true:
      res.status(200).json({ valid });
      break;
    case false:
      res
        .status(200)
        .json({ valid, message: idValidation || "ID already exists" });
      break;
  }
});
