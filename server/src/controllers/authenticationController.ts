import {
  login,
  LoginException,
  logout,
} from "@/services/authenticationService";
import { RequestHandler } from "express";

export const loginController: RequestHandler = async (req, res) => {
  const { id, password } = req.body;
  if (typeof id !== "string" || typeof password !== "string") {
    res.status(400).end();
    return;
  }

  try {
    const session = await login(req.session, id, password);
    res.status(201).json(session);
  } catch (error) {
    if (error instanceof LoginException) {
      res.status(401).json({
        error,
      });
      return;
    }
    throw error;
  }
};

export const logoutController: RequestHandler = async (req, res) => {
  await logout(req.session);
  res.status(201).end();
};
