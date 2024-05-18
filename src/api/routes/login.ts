import { Request, Response } from "express";
import { validationResult } from "express-validator";
import validators from "../util/validators.js";

export default [
  validators.email.bail().custom((input) => {}),
  validators.password,
  (req: Request, res: Response) => {
    const validation = validationResult(req);

    if (!validation.isEmpty()) {
      res.status(400).end();
      return;
    }

    const {
      email,
      password,
    }: {
      email: string;
      password: string;
    } = req.body;

    res.redirect("/");
  },
];
