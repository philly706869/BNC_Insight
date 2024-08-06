import { Router } from "express";
import { router as articleRouter } from "./article/route";
import { router as loginRouter } from "./logout/route";
import { router as userRouter } from "./user/route";

export const router = Router();

router.use(articleRouter);
router.use(userRouter);
router.use(loginRouter);
router.use(loginRouter);
