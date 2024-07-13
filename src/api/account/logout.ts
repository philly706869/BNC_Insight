import { Router } from "express";
import { logger } from "../../util/logger.js";

export const logoutRouter = Router();

logoutRouter.post(`/`, (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      logger.error(error);
      res.status(500).end();
    } else res.status(201).end();
  });
});
