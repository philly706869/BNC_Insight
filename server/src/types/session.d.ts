import type { User } from "@/models/User";
import "express-session";

declare module "express-session" {
  interface SessionData {
    userUid: User["uid"];
  }
}
