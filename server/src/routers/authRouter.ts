import {
  currentUserController,
  signinController,
  signoutController,
  signupController,
} from "@/controllers/authController";
import { Router } from "express";

export const authRouter = Router();
authRouter.get("/current", currentUserController);
authRouter.post("/signup", signupController);
authRouter.post("/signin", signinController);
authRouter.post("/signout", signoutController);
