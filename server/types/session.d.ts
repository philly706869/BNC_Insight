import { User } from "@/models/User";
import "express-session";

declare module "express-session" {
  interface SessionData extends AdditionalSessionData {}
}

type AdditionalSessionData = SessionData;

export type SessionData = {
  user: UserSessionData;
};

export type UserSessionData = Pick<
  User,
  "uid" | "uuid" | "name" | "isAdmin" | "createdAt"
>;

export type PublicSessionData = {
  user: Pick<UserSessionData, "uuid" | "name" | "isAdmin" | "createdAt"> | null;
};
