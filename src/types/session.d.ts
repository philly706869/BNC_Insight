import "express-session";

declare module "express-session" {
  interface SessionData {
    user: {
      uid: number;
      uuid: string;
      name: string;
      isAdmin: boolean;
      createdAt: Date;
    };
  }
}
