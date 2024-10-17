import { ImageController } from "@/controllers/image-controller";
import { env } from "@/env";
import { authVerifier } from "@/middlewares/auth-verifier";
import { ImageService } from "@/services/image-service";
import { safeRequestHandler } from "@/utils/async-request-handler";
import { IMAGE_MIME_TYPES } from "@/utils/constants";
import { Router } from "express";
import multer from "multer";
import path from "path";

export const imageRouter = Router();
const service = new ImageService();
const controller = new ImageController(service);
imageRouter.get("/:name", safeRequestHandler(controller.get.bind(controller)));
imageRouter.post(
  "/",
  authVerifier,
  multer({
    dest: path.resolve(env.server.uploadTempPath),
    limits: { fileSize: env.image.maxBytes },
    fileFilter(req, file, callback) {
      if (IMAGE_MIME_TYPES.includes(file.mimetype)) callback(null, true);
      else callback(null, false);
    },
  }).single("image"),
  safeRequestHandler(controller.post.bind(controller))
);
