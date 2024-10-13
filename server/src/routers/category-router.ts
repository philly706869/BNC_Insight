import { CategoryController } from "@/controllers/category-controller";
import { dataSource } from "@/database/data-source";
import { CategoryService } from "@/services/category-service";
import { Router } from "express";

export const categoryRouter = Router();
const service = new CategoryService(dataSource);
const controller = new CategoryController(service);
categoryRouter.get("/", controller.getAll);
categoryRouter.post("/", controller.post);
categoryRouter.patch("/:id", controller.patch);
categoryRouter.delete("/:id", controller.delete);
