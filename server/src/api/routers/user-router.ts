import { database } from "@/database/database";
import { bound } from "@/utils/bound";
import { safeAsyncHandler as safe } from "@/utils/safe-async-handler";
import { Router } from "express";
import { UserController } from "../controllers/user-controller";
import { UserService } from "../services/user-service";

export const userRouter = Router();
const service = new UserService(database);
const controller = new UserController(service);
userRouter.get("/:username", safe(bound(controller, "get")));
userRouter.patch("/", safe(bound(controller, "patch")));
userRouter.delete("/", safe(bound(controller, "delete")));
