import { Request, Response } from "express";

export const logout = [
  (req: Request, res: Response) => {
    req.session.destroy((error) => {
      console.error(error); // TODO
    });
  },
];
