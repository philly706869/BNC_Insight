import { Router } from "express";
import { accountRouter } from "./account/account.js";
import { articleRouter } from "./article.js";
import { categoriesRouter } from "./categories.js";

export const apiRouter = Router();

apiRouter.use("/account", accountRouter);
apiRouter.use("/article", articleRouter);
apiRouter.use("/categories", categoriesRouter);
