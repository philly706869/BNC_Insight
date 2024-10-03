import { AuthController } from "@/controllers/auth-controller";
import { dataSource } from "@/database/data-source";
import { AuthService } from "@/services/auth-service";
import { Router } from "express";

export const authRouter = Router();
const service = new AuthService(dataSource);
const controller = new AuthController(service);
authRouter.post("/verify-auth-token", controller.verifyAuthToken);
authRouter.post("/signup", controller.signup);
authRouter.post("/signin", controller.signin);
authRouter.post("/signout", controller.signout);
authRouter.get("/current-user", controller.getCurrentUser);
