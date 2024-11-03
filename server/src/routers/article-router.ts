import { ArticleController } from "@/controllers/article-controller";
import { database } from "@/database/database";
import { ArticleService } from "@/services/article-service";
import { Router } from "express";

export const articleRouter = Router();
const service = new ArticleService(database);
const controller = new ArticleController(service);

articleRouter.get("/:id", (req, res, next) =>
  controller.getOne(req, res, next).catch(next)
);

articleRouter.get("/", (req, res, next) =>
  controller.getMany(req, res).catch(next)
);

articleRouter.post("/", (req, res, next) =>
  controller.post(req, res).catch(next)
);

articleRouter.patch("/:id", (req, res, next) =>
  controller.patch(req, res, next).catch(next)
);

articleRouter.delete("/:id", (req, res, next) =>
  controller.delete(req, res, next).catch(next)
);
