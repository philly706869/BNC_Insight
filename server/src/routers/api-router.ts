import cors from "cors";
import { json, Router } from "express";
import { articleRouter } from "./article-router";
import { authRouter } from "./auth-router";
import { categoryRouter } from "./category-router";
import { imageRouter } from "./image-router";
import { userRouter } from "./user-router";

export const apiRouter = Router();
apiRouter.use(cors());
apiRouter.use(json());
apiRouter.use("/auth", authRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/categories", categoryRouter);
apiRouter.use("/articles", articleRouter);
apiRouter.use("/images", imageRouter);
