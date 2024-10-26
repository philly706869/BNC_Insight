import { config } from "@/config";
import { ImageController } from "@/controllers/image-controller";
import { authVerifier } from "@/middlewares/auth-verifier";
import { ImageService } from "@/services/image-service";
import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import multer, { MulterError } from "multer";
import path from "path";

export const imageRouter = Router();
const service = new ImageService();
const controller = new ImageController(service);

imageRouter.get("/:name", (req, res, next) =>
  controller.get(req, res, next).catch(next)
);

const supportedMIMETypes = config.image.supportedFormats.map(
  (format) => `image/${format}`
);

const upload = multer({
  dest: path.resolve(config.image.tempPath),
  limits: { fileSize: config.image.maxBytes },
  fileFilter(req, file, callback) {
    if (!supportedMIMETypes.includes(file.mimetype)) {
      callback(null, false);
      return;
    }
    callback(null, true);
  },
}).single("image");

const rateLimiter = rateLimit({
  windowMs: 60000,
  limit: 10,
});

imageRouter.post(
  "/",
  rateLimiter,
  authVerifier,
  (req, res, next) => {
    upload(req, res, (error) => {
      if (!(error instanceof MulterError)) {
        next(error);
        return;
      }
      if (error.code === "LIMIT_FILE_SIZE") {
        res.status(413).end();
        return;
      }
      if (error.code === "LIMIT_UNEXPECTED_FILE") {
        res.status(400).end();
        return;
      }
      next(error);
    });
  },
  (req, res, next) => controller.post(req, res).catch(next)
);
