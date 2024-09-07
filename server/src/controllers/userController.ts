import { getOwnUserData } from "@/services/authService";
import { RequestHandler } from "express";

export const createUserController: RequestHandler = (req, res) => {
  const { authToken, id, password, name } = req.body;
  if (
    typeof authToken !== "string" ||
    typeof id !== "string" ||
    typeof password !== "string" ||
    typeof name !== "string"
  ) {
    res.status(400).end();
    return;
  }
};
export const findUserController: RequestHandler = (req, res) => {};
export const updateUserController: RequestHandler = (req, res) => {};
export const deleteUserController: RequestHandler = (req, res) => {};

export const currentUserController: RequestHandler = async (req, res) => {
  const userData = await getOwnUserData(req.session);
  res.status(200).json(userData);
};
