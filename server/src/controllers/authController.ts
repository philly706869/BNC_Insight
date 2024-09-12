import {
  signin,
  SigninError,
  signout,
  signup,
  SignupError,
} from "@/services/authService";
import {
  extractProtectedUserData,
  getUserFromSession,
} from "@/services/userService";
import { RequestHandler } from "express";

export const signupHandler: RequestHandler = async (req, res) => {
  const { authToken, username, password, name } = req.body;
  if (
    typeof authToken !== "string" ||
    typeof username !== "string" ||
    typeof password !== "string" ||
    typeof name !== "string"
  ) {
    res.status(400).end();
    return;
  }

  try {
    const user = await signup(authToken, username, password, name);
    req.session.userUid = user.uid;
    const currentUser = extractProtectedUserData(user);
    res.status(201).json(currentUser);
  } catch (error) {
    if (error instanceof SignupError) {
      res.status(422).json({
        error: error.errorCode,
      });
    } else throw error;
  }
};

export const signinHandler: RequestHandler = async (req, res) => {
  const { username, password } = req.body;
  if (typeof username !== "string" || typeof password !== "string") {
    res.status(400).end();
    return;
  }

  try {
    const user = await signin(req.session, username, password);
    const currentUser = extractProtectedUserData(user);
    res.status(201).json(currentUser);
  } catch (error) {
    if (error instanceof SigninError) {
      res.status(401).json({
        error: error.errorCode,
      });
    } else throw error;
  }
};

export const signoutHandler: RequestHandler = async (req, res) => {
  await signout(req.session);
  res.status(201).end();
};

export const getCurrentUserHandler: RequestHandler = async (req, res) => {
  const user = await getUserFromSession(req.session);
  if (!user) {
    res.status(200).json(null);
    return;
  }
  const currentUser = extractProtectedUserData(user);
  res.status(200).json(currentUser);
};
