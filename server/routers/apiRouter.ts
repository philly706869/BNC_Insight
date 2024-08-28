import { json, Router } from "express";
import { articleRouter } from "./articleRouter";
import { authRouter } from "./authRouter";
import { userRouter } from "./userRouter";

export const api = Router();

api.use(json());
api.use("/auth", authRouter);
api.use("/user", userRouter);
api.use("/article", articleRouter);
