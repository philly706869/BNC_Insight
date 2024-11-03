import { config } from "@/config";
import { ImageController } from "@/controllers/image-controller";
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
  handler(req, res) {
    res.status(429).error({
      error: "TOO_MANY_REQUESTS",
      message: "Too many requests, please try again later",
    });
  },
});

imageRouter.post(
  "/",
  rateLimiter,
  (req, res, next) => {
    upload(req, res, (error) => {
      if (!(error instanceof MulterError)) {
        next(error);
        return;
      }
      if (error.code === "LIMIT_FILE_SIZE") {
        res.status(413).error({
          error: "FILE_TOO_LARGE",
          message: `File cannot bigger than ${config.image.maxBytes} bytes`,
        });
        return;
      }
      if (error.code === "LIMIT_UNEXPECTED_FILE") {
        res.status(415).error({
          error: "UNSUPPORTED_FILE",
          message: "Unsupported file format",
        });
        return;
      }
      next(error);
    });
  },
  (req, res, next) => controller.post(req, res).catch(next)
);
