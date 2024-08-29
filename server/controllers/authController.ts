import {
  getPublicSessionData,
  login,
  LoginError,
  logout,
} from "@/services/authService";
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
    if (error instanceof LoginError) {
      res.status(401).end();
      return;
    }
    throw error;
  }
};

export const logoutController: RequestHandler = async (req, res) => {
  await logout(req.session);
  res.status(201).end();
};

export const sessionController: RequestHandler = (req, res) => {
  const sessionData = getPublicSessionData(req.session);
  res.status(200).json(sessionData);
};
