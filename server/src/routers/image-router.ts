import { ImageController } from "@/controllers/image-controller";
import { TooManyRequestError } from "@/errors/controller-error";
import { ImageService } from "@/services/image-service";
import { Router } from "express";
import { rateLimit } from "express-rate-limit";

export const imageRouter = Router();
const service = new ImageService();
const controller = new ImageController(service);

imageRouter.get("/:name", (req, res, next) => {
  controller.get(req, res, next).catch(next);
});

const rateLimiter = rateLimit({
  windowMs: 60000,
  limit: 10,
  handler(req, res, next) {
    next(new TooManyRequestError());
  },
});

imageRouter.post("/", rateLimiter, (req, res, next) => {
  controller.post(req, res, next).catch(next);
});
