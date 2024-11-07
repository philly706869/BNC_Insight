import { UserController } from "@/controllers/user-controller";
import { database } from "@/database/database";
import { UserService } from "@/services/user-service";
import { safeAsyncHandler as safe } from "@/utils/safe-async-handler";
import { Router } from "express";

export const userRouter = Router();
const service = new UserService(database);
const controller = new UserController(service);
userRouter.get("/:username", safe(controller.get));
userRouter.patch("/", safe(controller.patch));
userRouter.delete("/", safe(controller.delete));
