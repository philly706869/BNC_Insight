import { CategoryController } from "@/controllers/category-controller";
import { dataSource } from "@/database/data-source";
import { authVerifier } from "@/middlewares/auth-verifier";
import { CategoryService } from "@/services/category-service";
import { safeRequestHandler } from "@/utils/async-request-handler";
import { Router } from "express";

export const categoryRouter = Router();
const service = new CategoryService(dataSource);
const controller = new CategoryController(service);
categoryRouter.get("/", safeRequestHandler(controller.getAll.bind(controller)));
categoryRouter.post(
  "/",
  authVerifier,
  safeRequestHandler(controller.post.bind(controller))
);
categoryRouter.patch(
  "/:id",
  authVerifier,
  safeRequestHandler(controller.patch.bind(controller))
);
categoryRouter.delete(
  "/:id",
  authVerifier,
  safeRequestHandler(controller.delete.bind(controller))
);
