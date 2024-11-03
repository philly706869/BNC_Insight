import { CategoryController } from "@/controllers/category-controller";
import { database } from "@/database/database";
import { CategoryService } from "@/services/category-service";
import { Router } from "express";

export const categoryRouter = Router();
const service = new CategoryService(database);
const controller = new CategoryController(service);

categoryRouter.get("/", (req, res, next) =>
  controller.getAll(req, res).catch(next)
);

categoryRouter.post("/", (req, res, next) =>
  controller.post(req, res).catch(next)
);

categoryRouter.patch("/:id", (req, res, next) =>
  controller.patch(req, res, next).catch(next)
);

categoryRouter.delete("/:id", (req, res, next) =>
  controller.delete(req, res, next).catch(next)
);
