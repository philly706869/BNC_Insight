import { CategoryController } from "@/controllers/category-controller";
import { database } from "@/database/database";
import { CategoryService } from "@/services/category-service";
import { safeAsyncHandler as safe } from "@/utils/safe-async-handler";
import { Router } from "express";

export const categoryRouter = Router();
const service = new CategoryService(database);
const controller = new CategoryController(service);
categoryRouter.get("/", safe(controller.getAll));
categoryRouter.post("/", safe(controller.post));
categoryRouter.patch("/:id", safe(controller.patch));
categoryRouter.delete("/:id", safe(controller.delete));
