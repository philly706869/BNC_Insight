import { AuthToken } from "@/database/entities/auth-token";
import {
  AuthService,
  signin,
  SigninError,
  signout,
  signup,
  SignupError,
} from "@/services/auth-service";
import { getUserFromSession } from "@/services/user-service";
import { Request, Response } from "express";

export class AuthController {
  public constructor(private readonly authService: AuthService) {}

  public async verifyAuthToken(req: Request, res: Response): Promise<void> {
    const { authToken } = req.body;
    if (typeof authToken !== "string") res.status(400).end();
    else if (!AuthToken.verifyToken(authToken)) res.status(400).end();
    else if ((await findAuthToken(authToken)) === null) res.status(400).end();
    else res.status(200).end();
  }

  public async signup(req: Request, res: Response): Promise<void> {
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
          error: error.error,
        });
      } else throw error;
    }
  }

  public async signin(req: Request, res: Response): Promise<void> {
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
          error: error.error,
        });
      } else throw error;
    }
  }

  public async signout(req: Request, res: Response): Promise<void> {
    await signout(req.session);
    res.status(201).end();
  }

  public async getCurrentUser(req: Request, res: Response): Promise<void> {
    const user = await getUserFromSession(req.session);
    res.status(200).json(user);
  }
}
