import express from "express";
import { FieldValidationError, validationResult } from "express-validator";
import auth from "./validation/auth.js";

export default express
  .Router()
  .use(auth)
  .post(
    "/",
    // validators.newEmail,
    // validators.password,
    // validators.name,
    // validators.authToken
    //   .bail()
    //   .custom((input) => {})
    //   .withMessage("Authentication token is not valid."),
    (req, res) => {
      const validation = validationResult(req);

      if (!validation.isEmpty()) {
        res.status(400).json({
          error: (validation.array() as FieldValidationError[]).reduce(
            (errors, error) => ({ ...errors, [error.path]: error.msg }),
            {}
          ),
        });
        return;
      }

      const {
        email,
        password,
        name,
        authToken,
      }: {
        email: string;
        password: string;
        name: string;
        authToken: string;
      } = req.body;

      res.status(201).end();
    }
  );
