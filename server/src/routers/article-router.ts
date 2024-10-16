import { ArticleController } from "@/controllers/article-controller";
import { dataSource } from "@/database/data-source";
import { env } from "@/env";
import { ArticleService } from "@/services/article-service";
import { Router } from "express";
import multer from "multer";
import path from "path";

export const articleRouter = Router();
const service = new ArticleService(dataSource);
const controller = new ArticleController(service);
articleRouter.get("/:id", controller.getOne.bind(controller));
articleRouter.get("/", controller.getMany.bind(controller));
articleRouter.post(
  "/",
  multer({
    dest: path.resolve(env.server.uploadTempPath),
    limits: {
      fileSize: env.thumbnail.maxBytes,
    },
    fileFilter(req, file, callback) {
      if (env.thumbnail.supportedMIMETypes.includes(file.mimetype))
        callback(null, true);
      else callback(null, false);
    },
  }).single("thumbnail"),
  controller.post.bind(controller)
);
articleRouter.patch("/:id", controller.patch.bind(controller));
articleRouter.delete("/:id", controller.delete.bind(controller));
