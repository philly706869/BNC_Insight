import {
  deleteUserController,
  findUserController,
} from "@/controllers/userController";
import { Router } from "express";

export const userRouter = Router();
userRouter.get("/", findUserController);
userRouter.delete("/", deleteUserController);
