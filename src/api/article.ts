import { Router } from "express";
import { body, query, validationResult } from "express-validator";
import { Article } from "../model/Article.js";
import { categories, Category } from "../model/categories.js";
import { User } from "../model/User.js";
import { logger } from "../util/logger.js";

export const articleRouter = Router();

articleRouter.get(
  "/",
  query("uid").isInt({ min: 1, max: 65535 }),
  async (req, res) => {
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
      res.status(400).json({
        error: "INVALID_UID",
        message: "Uid must be an integer between 1 and 65535.",
      });
      return;
    }

    const uid = parseInt(req.query!!.uid);

    const article = await Article.findByPk(uid);

    if (!article) {
      res.status(404).json({
        error: "ARTICLE_NOT_FOUND",
        message: "The requested article does not exist.",
      });
      return;
    }

    article.views += 1;
    article.save();

    const uploader = await User.findByPk(article.uploaderUid);

    res.status(200).json({
      uid: article.uid,
      uploader: uploader
        ? {
            uuid: uploader.uuid,
            name: uploader.name,
            isAdmin: uploader.isAdmin,
          }
        : null,
      category: article.category,
      title: article.title,
      subtitle: article.subtitle,
      content: article.content,
      views: article.views,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
    });
  }
);

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
      content: any[];
    } = req.body;

    const article = new Article({
      uploaderUid: req.session.user.uid,
      category,
      title,
      subtitle,
      content,
    });

    await article.save();

    logger.info(`article posted (uid: ${article.uid})`);

    res.status(201).json({ articleUid: article.uid });
  }
);
