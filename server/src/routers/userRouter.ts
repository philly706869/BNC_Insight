import {
  deleteUserHandler,
  getUserHandler,
  patchUserHandler,
} from "@/controllers/userController";
import { Router } from "express";

export const userRouter = Router();
userRouter.get("/:username", getUserHandler);
userRouter.patch("/", patchUserHandler);
userRouter.delete("/", deleteUserHandler);
