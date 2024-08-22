import { logger } from "@/utils/logger";
import { Router } from "express";

export const logoutRouter = Router();

logoutRouter.post("/", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      logger.error(error);
      res.status(500).end();
      return;
    }
    res.status(201).end();
  });
});
