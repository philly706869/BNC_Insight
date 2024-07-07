import "express-session";

declare module "express-session" {
  interface SessionData {
    user: {
      uid: number;
      isAdmin: boolean;
    };
  }
}
