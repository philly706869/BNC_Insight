import { ArticleController } from "@/controllers/article-controller";
import { database } from "@/database/database";
import { ArticleService } from "@/services/article-service";
import { safeAsyncHandler as safe } from "@/utils/safe-async-handler";
import { Router } from "express";

export const articleRouter = Router();
const service = new ArticleService(database);
const controller = new ArticleController(service);
articleRouter.get("/:id", safe(controller.getOne));
articleRouter.get("/", safe(controller.getMany));
articleRouter.post("/", safe(controller.post));
articleRouter.patch("/:id", safe(controller.patch));
articleRouter.delete("/:id", safe(controller.delete));
