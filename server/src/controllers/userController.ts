import {
  extractPublicUserData,
  getUserByUsername,
} from "@/services/userService";
import {
  UserUsername,
  UserUsernameVerifyError,
} from "@/valueObjects/userValueObjects";
import { RequestHandler } from "express";

export const getUserHandler: RequestHandler = async (req, res) => {
  const { username } = req.params;
  const userUsername = UserUsername.verify(username);
  if (userUsername instanceof UserUsernameVerifyError) {
    res.status(404).end();
    return;
  }
  const user = await getUserByUsername(userUsername);
  if (!user) {
    res.status(404).end();
    return;
  }
  const userData = extractPublicUserData(user);
  res.status(200).json(userData);
};

export const patchUserHandler: RequestHandler = async (req, res) => {};

export const deleteUserHandler: RequestHandler = async (req, res) => {};
