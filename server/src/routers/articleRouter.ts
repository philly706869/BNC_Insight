import { getArticlesHandler } from "@/controllers/articleController";
import { Router } from "express";

export const articleRouter = Router();
articleRouter.get("/:id", getArticlesHandler);
