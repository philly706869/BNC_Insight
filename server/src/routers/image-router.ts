import { ImageController } from "@/controllers/image-controller";
import { ImageService } from "@/services/image-service";
import { Router } from "express";
import { rateLimit } from "express-rate-limit";

export const imageRouter = Router();
const service = new ImageService();
const controller = new ImageController(service);

imageRouter.get("/:name", (req, res, next) =>
  controller.get(req, res, next).catch(next)
);

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

imageRouter.post("/", rateLimiter, (req, res, next) =>
  controller.post(req, res).catch(next)
);
