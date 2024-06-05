import express from "express";
import { body, validationResult } from "express-validator";
import { isAllocableToken } from "../../model/sequelize.js";
import { validate } from "../validator.js";

export const token = express.Router();

token.post("/", body("token").isString(), validate, async (req, res) => {
  res
    .status(200)
    .json({ valid: await isAllocableToken(req.body.token as string) });
});
