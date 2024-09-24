import { getArticlesHandler } from "@/controllers/article-controller";
import { Router } from "express";

export const articleRouter = Router();
articleRouter.get("/:id", getArticlesHandler);
