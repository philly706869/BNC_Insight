import { Router } from "express";
import { query, validationResult } from "express-validator";
import { User } from "../model/User.js";

export const idRouter = Router();

idRouter.get("/", query("id"), (req, res) => {
  if (!validationResult(req).isEmpty()) {
    res
      .status(400)
      .error({ error: "ID_NOT_PROVIDED", message: "You must provide id." });
    return;
  }

  const id: string = req.query!!.id;
  const result = User.validateId(id);
  const valid = result === null;

  res.status(200).json({
    valid,
    message: result,
  });
});
