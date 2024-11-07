import { ImageController } from "@/controllers/image-controller";
import { TooManyRequestError } from "@/errors/controller-error";
import { ImageService } from "@/services/image-service";
import { bound } from "@/utils/bound";
import { safeAsyncHandler as safe } from "@/utils/safe-async-handler";
import { Router } from "express";
import { rateLimit } from "express-rate-limit";

export const imageRouter = Router();
const service = new ImageService();
const controller = new ImageController(service);

imageRouter.get("/:name", safe(bound(controller, "get")));

const rateLimiter = rateLimit({
  windowMs: 60000,
  limit: 10,
  handler(req, res, next) {
    next(new TooManyRequestError());
  },
});

imageRouter.post("/", rateLimiter, safe(bound(controller, "post")));
