import {
  signin,
  SigninError,
  signout,
  signup,
  SignupError,
} from "@/services/authService";
import { extractCurrentUser, getUserFromSession } from "@/services/userService";
import { RequestHandler } from "express";

export const signupController: RequestHandler = async (req, res) => {
  const { token, username, password, name } = req.body;
  if (
    typeof token !== "string" ||
    typeof username !== "string" ||
    typeof password !== "string" ||
    typeof name !== "string"
  ) {
    res.status(400).end();
    return;
  }

  try {
    const user = await signup(token, username, password, name);
    req.session.userUid = user.uid;
    const currentUser = extractCurrentUser(user);
    res.status(201).json(currentUser);
  } catch (error) {
    if (error instanceof SignupError) {
      res.status(422).json({
        error: error.errorCode,
      });
    } else throw error;
  }
};

export const signinController: RequestHandler = async (req, res) => {
  const { username, password } = req.body;
  if (typeof username !== "string" || typeof password !== "string") {
    res.status(400).end();
    return;
  }

  try {
    const user = await signin(req.session, username, password);
    const currentUser = extractCurrentUser(user);
    res.status(201).json(currentUser);
  } catch (error) {
    if (error instanceof SigninError) {
      res.status(401).json({
        error: error.errorCode,
      });
    } else throw error;
  }
};

export const signoutController: RequestHandler = async (req, res) => {
  await signout(req.session);
  res.status(201).end();
};

export const currentUserController: RequestHandler = async (req, res) => {
  const user = await getUserFromSession(req.session);
  if (!user) {
    res.status(200).json(null);
    return;
  }
  const currentUser = extractCurrentUser(user);
  res.status(200).json(currentUser);
};
