import { Router } from "express";

export const logoutRouter = Router();

logoutRouter.post("/", (req, res) => {
  req.session.destroy((error) => {
    if (error) res.status(500).end();
    else res.status(201).end();
  });
});
