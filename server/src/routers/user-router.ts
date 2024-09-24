import {
  deleteUserHandler,
  getUserHandler,
  patchUserHandler,
} from "@/controllers/user-controller";
import { Router } from "express";

export const userRouter = Router();
userRouter.get("/:username", getUserHandler);
userRouter.patch("/", patchUserHandler);
userRouter.delete("/", deleteUserHandler);
