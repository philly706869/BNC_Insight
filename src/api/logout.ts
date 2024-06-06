import express, { Request, Response } from "express";

export const logout = express.Router();

logout.post("/", (req: Request, res: Response) => {
  req.session.destroy((error) => {});

  res.status(201).end();
});
