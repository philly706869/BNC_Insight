import { body } from "express-validator";

export const emailValidator = body("email")
  .isString()
  .withMessage("Email must be string.")
  .bail()
  .isEmail()
  .withMessage("Email is not valid.");

export const newEmailValidator = emailValidator
  .bail()
  .custom((input) => {})
  .withMessage("Email is already exists.");

export const passwordValidator = body("password")
  .isString()
  .withMessage("Password must be string.")
  .bail()
  .isLength({ min: 12 })
  .withMessage("Password cannot be shorter than 12 characters.")
  .bail()
  .isByteLength({ max: 72 })
  .withMessage("Password cannot be greater than 72 bytes.");

export const nameValidator = body("name")
  .isString()
  .withMessage("Name must be string.")
  .bail()
  .custom((input) => {});

export const authTokenValidator = body("authToken")
  .isString()
  .withMessage("AuthToken must be string.")
  .bail()
  .custom((input) => {});

export default {
  email: emailValidator,
  newEmail: newEmailValidator,
  password: passwordValidator,
  name: nameValidator,
  authToken: authTokenValidator,
};
