import { Router } from "express";
import { body } from "express-validator";
import { categories } from "../model/categories.js";

export const articleRouter = Router();

articleRouter.post(
  "/",
  body("category")
    .isString()
    .bail()
    .custom((value) => categories.includes(value)),
  body("title").isString().bail().isLength({ min: 1, max: 64 }),
  body("subtitle").isString().bail().isLength({ min: 1, max: 128 }),
  body("content").isString().bail().isLength({ min: 1, max: 65535 }),
  (req, res) => {}
);
