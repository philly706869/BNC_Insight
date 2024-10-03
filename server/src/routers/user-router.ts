import { UserController } from "@/controllers/user-controller";
import { dataSource } from "@/database/data-source";
import { UserService } from "@/services/user-service";
import { Router } from "express";

export const userRouter = Router();
const service = new UserService(dataSource);
const controller = new UserController(service);
userRouter.get("/:username", controller.get);
userRouter.patch("/", controller.patch);
userRouter.delete("/", controller.delete);
