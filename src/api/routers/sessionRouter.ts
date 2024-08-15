import { Router } from "express";

export const sessionRouter = Router();

sessionRouter.get("/", (req, res) => {
  const { user } = req.session;
  res.status(200).json({
    user:
      user !== undefined
        ? {
            uuid: user.uuid,
            name: user.name,
            isAdmin: user.isAdmin,
            createdAt: user.createdAt,
          }
        : undefined,
  });
});
