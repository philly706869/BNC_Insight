import { ArticleController } from "@/controllers/article-controller";
import { dataSource } from "@/database/data-source";
import { env } from "@/env";
import { authVerifier } from "@/middlewares/auth-verifier";
import { ArticleService } from "@/services/article-service";
import { safeRequestHandler } from "@/utils/async-request-handler";
import { IMAGE_MIME_TYPES } from "@/utils/constants";
import { Router } from "express";
import multer from "multer";
import path from "path";

export const articleRouter = Router();
const service = new ArticleService(dataSource);
const controller = new ArticleController(service);
articleRouter.get(
  "/:id",
  safeRequestHandler(controller.getOne.bind(controller))
);
articleRouter.get("/", safeRequestHandler(controller.getMany.bind(controller)));
articleRouter.post(
  "/",
  authVerifier,
  multer({
    dest: path.resolve(env.server.uploadTempPath),
    limits: {
      fileSize: env.thumbnail.maxBytes,
    },
    fileFilter(req, file, callback) {
      if (IMAGE_MIME_TYPES.includes(file.mimetype)) callback(null, true);
      else callback(null, false);
    },
  }).single("thumbnail"),
  safeRequestHandler(controller.post.bind(controller))
);
articleRouter.patch(
  "/:id",
  authVerifier,
  safeRequestHandler(controller.patch.bind(controller))
);
articleRouter.delete(
  "/:id",
  authVerifier,
  safeRequestHandler(controller.delete.bind(controller))
);
