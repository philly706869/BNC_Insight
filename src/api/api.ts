import { Router } from "express";
import { articleRouter } from "./article.js";
import { categoryRouter } from "./category.js";
import { userRouter } from "./user.js";
import { validate } from "./validate.js";

export const apiRouter = Router();

apiRouter.use("/validate", validate);
apiRouter.use("/user", userRouter);
apiRouter.use("/category", categoryRouter);
apiRouter.use("/article", articleRouter);
