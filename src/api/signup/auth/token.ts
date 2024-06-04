import express from "express";
import { isAllocableToken } from "../../../model/sequelize.js";
import { body, validationResult } from "express-validator";

export const authToken = express.Router();

authToken.post("/", body("value").isString(), async (req, res) => {
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    res.status(400).json({ error: "token must be string" });
    return;
  }

  res
    .status(200)
    .json({ valid: await isAllocableToken(req.body.value as string) });
});
