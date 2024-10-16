import { ImageController } from "@/controllers/image-controller";
import { env } from "@/env";
import { ImageService } from "@/services/image-service";
import { Router } from "express";
import multer from "multer";
import path from "path";

export const imageRouter = Router();
const service = new ImageService();
const controller = new ImageController(service);
imageRouter.get("/:name", controller.get.bind(controller));
imageRouter.post(
  "/",
  multer({
    dest: path.resolve(env.server.uploadTempPath),
    limits: { fileSize: env.image.maxBytes },
    fileFilter(req, file, callback) {
      if (env.image.supportedMIMETypes.includes(file.mimetype))
        callback(null, true);
      else callback(null, false);
    },
  }).single("image"),
  controller.post.bind(controller)
);
