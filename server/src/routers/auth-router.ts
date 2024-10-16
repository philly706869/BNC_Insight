import { AuthController } from "@/controllers/auth-controller";
import { dataSource } from "@/database/data-source";
import { AuthService } from "@/services/auth-service";
import { Router } from "express";

export const authRouter = Router();
const service = new AuthService(dataSource);
const controller = new AuthController(service);
authRouter.post(
  "/verify-auth-token",
  controller.verifyAuthToken.bind(controller)
);
authRouter.post("/signup", controller.signup.bind(controller));
authRouter.post("/signin", controller.signin.bind(controller));
authRouter.post("/signout", controller.signout.bind(controller));
authRouter.get("/current-user", controller.getCurrentUser.bind(controller));
