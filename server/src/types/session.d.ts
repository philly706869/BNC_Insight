import type { User } from "@/database/entities/User";
import "express-session";

declare module "express-session" {
  interface SessionData {
    userUid: User["uid"];
  }
}
