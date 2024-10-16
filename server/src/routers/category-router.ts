import { CategoryController } from "@/controllers/category-controller";
import { dataSource } from "@/database/data-source";
import { CategoryService } from "@/services/category-service";
import { Router } from "express";

export const categoryRouter = Router();
const service = new CategoryService(dataSource);
const controller = new CategoryController(service);
categoryRouter.get("/", controller.getAll.bind(controller));
categoryRouter.post("/", controller.post.bind(controller));
categoryRouter.patch("/:id", controller.patch.bind(controller));
categoryRouter.delete("/:id", controller.delete.bind(controller));
