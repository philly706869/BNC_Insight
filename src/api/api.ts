import { json, Router } from "express";
import { articleRouter } from "./routers/articleRouter";
import { loginRouter } from "./routers/loginRouter";
import { logoutRouter } from "./routers/logoutRouter";
import { sessionRouter } from "./routers/sessionRouter";
import { userRouter } from "./routers/userRouter";

export const api = Router();

api.use(json());
api.use("/user", userRouter);
api.use("/login", loginRouter);
api.use("/logout", logoutRouter);
api.use("/session", sessionRouter);
api.use("/article", articleRouter);
