import { Router } from "express";
import { articleRouter } from "./article.js";
import { authRouter } from "./auth.js";
import { categoriesRouter } from "./categories.js";
import { userRouter } from "./user.js";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/user", userRouter);
apiRouter.use("/category", categoriesRouter);
apiRouter.use("/article", articleRouter);
