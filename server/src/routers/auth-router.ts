import { AuthController } from "@/controllers/auth-controller";
import { database } from "@/database/database";
import { AuthService } from "@/services/auth-service";
import { safeAsyncHandler as safe } from "@/utils/safe-async-handler";
import { Router } from "express";

export const authRouter = Router();
const service = new AuthService(database);
const controller = new AuthController(service);
authRouter.post("/verify-auth-token", safe(controller.verifyAuthToken));
authRouter.post("/signup", safe(controller.signup));
authRouter.post("/signin", safe(controller.signin));
authRouter.post("/signout", safe(controller.signout));
authRouter.get("/me", safe(controller.getCurrentUser));
authRouter.post("/update-password", safe(controller.updatePassword));
