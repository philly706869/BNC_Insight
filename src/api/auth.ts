import { Router } from "express";
import { query, validationResult } from "express-validator";
import { AuthToken } from "../model/AuthToken.js";

export const authRouter = Router();

authRouter.get(
  "/",
  query("token").isLength({ min: 1, max: 128 }),
  async (req, res) => {
    const token: string = req.query!!.token;
    const valid =
      !validationResult(req).isEmpty() || (await AuthToken.isAllocable(token));
    res.status(200).json({ valid });
  }
);
