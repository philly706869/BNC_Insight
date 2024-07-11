import { Router } from "express";
import Joi from "joi";
import { Article } from "../model/Article.js";
import { Category } from "../model/Category.js";
import { User } from "../model/User.js";
import { logger } from "../util/logger.js";

export const articleRouter = Router();

const querySchema = Joi.object<{ uid: number }>({
  uid: Joi.number().integer().min(1).max(65535).required(),
}).unknown(true);

articleRouter.get("/", async (req, res) => {
  const validation = querySchema.validate(req.query);
  if (validation.error) {
    res.status(400).end();
    return;
  }
  const { uid } = validation.value;

  const article = await Article.findByPk(uid);

  if (!article) {
    res.status(404).end();
    return;
  }

  article.views += 1;
  await article.save();

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
});

const bodySchema = Joi.object<{
  category: string;
  title: string;
  subtitle: string;
  content: any[];
}>({
  category: Joi.string()
    .custom(async (value: string) => {
      const category = await Category.findOne({ where: { name: value } });
      if (category) throw new Error();
      return value;
    })
    .required(),
  title: Joi.string().min(1).max(64).required(),
  subtitle: Joi.string().min(1).max(128).required(),
  content: Joi.array().required(),
}).unknown(true);

articleRouter.post("/", async (req, res) => {
  const user = req.session.user;
  if (!user) {
    res.status(401).end();
    return;
  }

  const validation = bodySchema.validate(req.body);
  if (validation.error) {
    res.status(400).end();
    return;
  }
  const { category, title, subtitle, content } = validation.value;

  const article = new Article({
    uploaderUid: user.uid,
    category,
    title,
    subtitle,
    content,
  });

  await article.save();

  logger.info(`article posted (uid: ${article.uid})`);

  res.status(201).json({ articleUid: article.uid });
});
