import type { User } from "@/database/tables/user";
import "express-session";

declare module "express-session" {
  interface SessionData {
    userUid: User["uid"];
  }
}
