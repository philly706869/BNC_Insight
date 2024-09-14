import { User } from "@/database/models/User";
import {
  extractPublicUserData,
  findUserByUsername,
} from "@/services/userService";
import { RequestHandler } from "express";

export const getUserHandler: RequestHandler = async (req, res) => {
  const { username } = req.params;
  const usernameError = User.verifyName(username);
  if (usernameError) {
    res.status(404).end();
    return;
  }

  const user = await findUserByUsername(username);
  if (!user) {
    res.status(404).end();
    return;
  }

  const userData = extractPublicUserData(user);
  res.status(200).json(userData);
};

export const patchUserHandler: RequestHandler = async (req, res) => {};

export const deleteUserHandler: RequestHandler = async (req, res) => {};
