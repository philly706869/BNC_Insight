import { UserController } from "@/controllers/user-controller";
import { dataSource } from "@/database/data-source";
import { authVerifier } from "@/middlewares/auth-verifier";
import { UserService } from "@/services/user-service";
import { Router } from "express";

export const userRouter = Router();
const service = new UserService(dataSource);
const controller = new UserController(service);

userRouter.get("/:username", (req, res, next) =>
  controller.get(req, res).catch(next)
);

userRouter.patch("/", authVerifier, (req, res, next) =>
  controller.patch(req, res).catch(next)
);

userRouter.delete("/", authVerifier, (req, res, next) =>
  controller.delete(req, res).catch(next)
);
