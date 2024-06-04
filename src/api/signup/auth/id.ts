import express from "express";
import { checkUserById } from "../../../model/sequelize.js";
import { body, validationResult } from "express-validator";

export const authId = express.Router();

authId.post("/", body("value").isString(), async (req, res) => {
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    res.status(400).json({ error: "id must be string" });
    return;
  }

  res
    .status(200)
    .json({ valid: !(await checkUserById(req.body.value as string, true)) });
});
