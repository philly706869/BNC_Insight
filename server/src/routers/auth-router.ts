import { AuthController } from "@/controllers/auth-controller";
import { dataSource } from "@/database/data-source";
import { authVerifier } from "@/middlewares/auth-verifier";
import { AuthService } from "@/services/auth-service";
import { safeRequestHandler } from "@/utils/async-request-handler";
import { Router } from "express";

export const authRouter = Router();
const service = new AuthService(dataSource);
const controller = new AuthController(service);
authRouter.post(
  "/verify-auth-token",
  safeRequestHandler(controller.verifyAuthToken.bind(controller))
);
authRouter.post(
  "/verify-username",
  safeRequestHandler(controller.verifyUsername.bind(controller))
);
authRouter.post(
  "/signup",
  safeRequestHandler(controller.signup.bind(controller))
);
authRouter.post(
  "/signin",
  safeRequestHandler(controller.signin.bind(controller))
);
authRouter.post(
  "/signout",
  safeRequestHandler(controller.signout.bind(controller))
);
authRouter.get(
  "/current-user",
  safeRequestHandler(controller.getCurrentUser.bind(controller))
);
authRouter.post(
  "/update-password",
  authVerifier,
  safeRequestHandler(controller.updatePassword.bind(controller))
);
