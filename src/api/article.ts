import { Router } from "express";
import { body, validationResult } from "express-validator";
import { Article } from "../model/Article.js";
import { categories, Category } from "../model/categories.js";

export const articleRouter = Router();

articleRouter.post(
  "/",
  body("category")
    .isString()
    .bail()
    .custom((value) => categories.includes(value)),
  body("title").isString().bail().isLength({ min: 1, max: 64 }),
  body("subtitle").isString().bail().isLength({ min: 1, max: 128 }),
  body("content").isArray(),
  async (req, res) => {
    const validation = validationResult(req);
    if (!validation.isEmpty() || !req.session.user) {
      res.status(400).end();
      return;
    }

    const {
      category,
      title,
      subtitle,
      content,
    }: {
      category: Category;
      title: string;
      subtitle: string;
      content: any;
    } = req.body;

    const article = new Article({
      uploaderUid: req.session.user.uid,
      category,
      title,
      subtitle,
      content,
    });

    await article.save();

    res.status(201).end();
  }
);
