import { UserController } from "@/controllers/user-controller";
import { database } from "@/database/database";
import { UserService } from "@/services/user-service";
import { Router } from "express";

export const userRouter = Router();
const service = new UserService(database);
const controller = new UserController(service);

userRouter.get("/:username", (req, res, next) => {
  controller.get(req, res, next).catch(next);
});

userRouter.patch("/", (req, res, next) => {
  controller.patch(req, res, next).catch(next);
});

userRouter.delete("/", (req, res, next) => {
  controller.delete(req, res, next).catch(next);
});
