import express from "express";
import { Request, Response } from "express";

export const logout = express.Router();

logout.post("/", (req: Request, res: Response) => {
  req.session.destroy((error) => {
    console.error(error); // TODO
  });
});
