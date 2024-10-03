import { ArticleController } from "@/controllers/article-controller";
import { dataSource } from "@/database/data-source";
import { ArticleService } from "@/services/article-service";
import { Router } from "express";

export const articleRouter = Router();
const service = new ArticleService(dataSource);
const controller = new ArticleController(service);
articleRouter.get("/:id", controller.getOne);
articleRouter.get("/", controller.getMany);
articleRouter.post("/", controller.post);
articleRouter.patch("/:id", controller.patch);
articleRouter.delete("/:id", controller.delete);
