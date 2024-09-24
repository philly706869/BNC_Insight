import cors from "cors";
import { json, Router } from "express";
import { articleRouter } from "./article-router";
import { authRouter } from "./auth-router";
import { categoryRouter } from "./category-router";
import { userRouter } from "./user-router";

export const api = Router();
api.use(cors());
api.use(json());
api.use("/auth", authRouter);
api.use("/users", userRouter);
api.use("/articles", articleRouter);
api.use("/categories", categoryRouter);
