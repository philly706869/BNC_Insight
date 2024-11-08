import { database } from "@/database/database";
import { bound } from "@/utils/bound";
import { safeAsyncHandler as safe } from "@/utils/safe-async-handler";
import { Router } from "express";
import { AuthController } from "../controllers/auth-controller";
import { AuthService } from "../services/auth-service";

export const authRouter = Router();
const service = new AuthService(database);
const controller = new AuthController(service);
authRouter.post(
  "/verify-auth-token",
  safe(bound(controller, "verifyAuthToken"))
);
authRouter.post("/signup", safe(bound(controller, "signup")));
authRouter.post("/signin", safe(bound(controller, "signin")));
authRouter.post("/signout", safe(bound(controller, "signout")));
authRouter.get("/me", safe(bound(controller, "getCurrentUser")));
authRouter.post("/update-password", safe(bound(controller, "updatePassword")));
