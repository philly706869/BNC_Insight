import cors from "cors";
import { json, Router } from "express";
import { articleRouter } from "./articleRouter";
import { authRouter } from "./authRouter";
import { categoryRouter } from "./categoryRouter";
import { userRouter } from "./userRouter";

export const api = Router();
api.use(cors());
api.use(json());
api.use("/auth", authRouter);
api.use("/users", userRouter);
api.use("/articles", articleRouter);
api.use("/categories", categoryRouter);
