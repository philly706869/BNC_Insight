import { config } from "@/config";
import { ImageController } from "@/controllers/image-controller";
import { authVerifier } from "@/middlewares/auth-verifier";
import { ImageService } from "@/services/image-service";
import { IMAGE_MIME_TYPES } from "@/utils/constants";
import { Router } from "express";
import multer from "multer";
import path from "path";

export const imageRouter = Router();
const service = new ImageService();
const controller = new ImageController(service);

imageRouter.get("/:name", (req, res, next) =>
  controller.get(req, res).catch(next)
);

imageRouter.post(
  "/",
  authVerifier,
  multer({
    dest: path.resolve(config.image.tempPath),
    limits: { fileSize: config.image.maxBytes },
    fileFilter(req, file, callback) {
      if (IMAGE_MIME_TYPES.includes(file.mimetype)) callback(null, true);
      else callback(null, false);
    },
  }).single("image"),
  (req, res, next) => controller.post(req, res).catch(next)
);
