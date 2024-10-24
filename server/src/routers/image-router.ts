import { config } from "@/config";
import { ImageController } from "@/controllers/image-controller";
import { authVerifier } from "@/middlewares/auth-verifier";
import { ImageService } from "@/services/image-service";
import { IMAGE_MIME_TYPES } from "@/utils/constants";
import { Router } from "express";
import multer, { MulterError } from "multer";
import path from "path";

export const imageRouter = Router();
const service = new ImageService();
const controller = new ImageController(service);

imageRouter.get("/:name", (req, res, next) =>
  controller.get(req, res).catch(next)
);

const upload = multer({
  dest: path.resolve(config.image.tempPath),
  limits: { fileSize: config.image.maxBytes },
  fileFilter(req, file, callback) {
    if (!IMAGE_MIME_TYPES.includes(file.mimetype)) {
      callback(null, false);
      return;
    }
    callback(null, true);
  },
}).single("image");

imageRouter.post(
  "/",
  authVerifier,
  (req, res, next) => {
    upload(req, res, (error) => {
      if (error) {
        if (error instanceof MulterError && error.code === "LIMIT_FILE_SIZE") {
          res.status(413).end();
        } else {
          next(error);
        }
      } else next();
    });
  },
  (req, res, next) => controller.post(req, res).catch(next)
);
