import express from "express";
import { AuthToken } from "../../model/sequelize.js";
import { body } from "express-validator";
import { validate } from "../validator.js";

export const token = express.Router();

token.post("/", body("token").isString(), validate, async (req, res) => {
  res
    .status(200)
    .json({ valid: await AuthToken.isAllocable(req.body.token as string) });
});
