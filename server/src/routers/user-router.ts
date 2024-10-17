import { UserController } from "@/controllers/user-controller";
import { dataSource } from "@/database/data-source";
import { authVerifier } from "@/middlewares/auth-verifier";
import { UserService } from "@/services/user-service";
import { safeRequestHandler } from "@/utils/async-request-handler";
import { Router } from "express";

export const userRouter = Router();
const service = new UserService(dataSource);
const controller = new UserController(service);
userRouter.get(
  "/:username",
  safeRequestHandler(controller.get.bind(controller))
);
userRouter.patch(
  "/",
  authVerifier,
  safeRequestHandler(controller.patch.bind(controller))
);
userRouter.delete(
  "/",
  authVerifier,
  safeRequestHandler(controller.delete.bind(controller))
);
