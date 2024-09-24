import { User } from "@/database/entities/User";
import { findUserByUsername } from "@/services/user-service";
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
