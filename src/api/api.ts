import { Router } from "express";
import { articleRouter } from "./article.js";
import { categoriesRouter } from "./categories.js";
import { userRouter } from "./user.js";

export const apiRouter = Router();

apiRouter.use("/user", userRouter);
apiRouter.use("/category", categoriesRouter);
apiRouter.use("/article", articleRouter);
