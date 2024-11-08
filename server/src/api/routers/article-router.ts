import { database } from "@/database/database";
import { bound } from "@/utils/bound";
import { safeAsyncHandler as safe } from "@/utils/safe-async-handler";
import { Router } from "express";
import { ArticleController } from "../controllers/article-controller";
import { ArticleService } from "../services/article-service";

export const articleRouter = Router();
const service = new ArticleService(database);
const controller = new ArticleController(service);
articleRouter.get("/:id", safe(bound(controller, "getOne")));
articleRouter.get("/", safe(bound(controller, "getMany")));
articleRouter.post("/", safe(bound(controller, "post")));
articleRouter.patch("/:id", safe(bound(controller, "patch")));
articleRouter.delete("/:id", safe(bound(controller, "delete")));
