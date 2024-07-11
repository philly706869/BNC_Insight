import { body } from "express-validator";

export const valueValidator = body("value")
  .exists()
  .withMessage({
    error: "VALUE_NOT_PROVIDED",
    message: "You must provide `value`.",
  })
  .bail()
  .isString()
  .withMessage({
    error: "INVALID_VALUE_TYPE",
    message: "`value` must be string.",
  });
