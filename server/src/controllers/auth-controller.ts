import { AuthTokenValue } from "@/database/values/auth-token-values";
import { UserValue } from "@/database/values/user-values";
import {
  IncorrectPasswordError,
  InvalidAuthTokenError,
  UserNotFoundError,
} from "@/errors/service-errors";
import { AuthService } from "@/services/auth-service";
import { Request, Response } from "express";
import { z } from "zod";

export class AuthController {
  public constructor(private readonly authService: AuthService) {}

  private static readonly verifyAuthTokenBodySchema = z.object({
    value: z.string(),
  });

  public async verifyAuthToken(req: Request, res: Response): Promise<void> {
    const bodyParseResult =
      await AuthController.verifyAuthTokenBodySchema.safeParseAsync(req.body);
    if (!bodyParseResult.success) {
      res.status(400).end();
      return;
    }

    const body = bodyParseResult.data;

    const result = await this.authService.verifyAuthToken(body.value);
    if (result) res.status(200).end();
    else res.status(422).end();
  }

  private static readonly verifyUsernameBodySchema = z.object({
    value: z.string(),
  });

  public async verifyUsername(req: Request, res: Response): Promise<void> {
    const bodyParseResult =
      await AuthController.verifyUsernameBodySchema.safeParseAsync(req.body);
    if (!bodyParseResult.success) {
      res.status(400).end();
      return;
    }

    const body = bodyParseResult.data;

    const result = await this.authService.verifyUsername(body.value);
    if (result) res.status(200).end();
    else res.status(422).end();
  }

  public async getCurrentUser(req: Request, res: Response): Promise<void> {
    try {
    const userDTO = await this.authService.getCurrentUser(req.session);
 
   }
    res.status(200).json(userDTO);
  }

  public async signup(req: Request, res: Response): Promise<void> {
    const {
      authToken: rawAuthToken,
      username: rawUsername,
      password: rawPassword,
      name: rawName,
    } = req.body;
    if (
      typeof rawAuthToken !== "string" ||
      typeof rawUsername !== "string" ||
      typeof rawPassword !== "string" ||
      typeof rawName !== "string"
    ) {
      res.status(400).end();
      return;
    }

    const authToken = AuthTokenValue.Token.verify(rawAuthToken);
    if (!authToken) {
      res.status(400).end();
      return;
    }

    const username = UserValue.Username.verify(rawUsername);
    if (!username) {
      res.status(400).end();
      return;
    }

    const password = UserValue.Password.verify(rawPassword);
    if (!password) {
      res.status(400).end();
      return;
    }

    const name = UserValue.Name.verify(rawName);
    if (!name) {
      res.status(400).end();
      return;
    }

    try {
      const userDTO = await this.authService.signup(
        req.session,
        authToken,
        username,
        password,
        name
      );
      res.status(201).json(userDTO);
    } catch (error) {
      if (error instanceof InvalidAuthTokenError)
        res.status(422).json({
          errorCode: "INVALID_AUTH_TOKEN",
          message: "Auth token is not valid.",
        });
      else throw error;
    }
  }

  public async signin(req: Request, res: Response): Promise<void> {
    const { username: rawUsername, password: rawPassword } = req.body;
    if (typeof rawUsername !== "string" || typeof rawPassword !== "string") {
      res.status(400).end();
      return;
    }

    const username = UserValue.Username.verify(rawUsername);
    if (!username) {
      res.status(400).end();
      return;
    }

    const password = UserValue.Password.verify(rawPassword);
    if (!password) {
      res.status(400).end();
      return;
    }

    try {
      const userDTO = await this.authService.signin(
        req.session,
        username,
        password
      );
      res.status(201).json(userDTO);
    } catch (error) {
      if (error instanceof UserNotFoundError)
        res.status(401).json({
          errorCode: "USER_NOT_FOUND",
          message: "User is not found.",
        });
      else if (error instanceof IncorrectPasswordError)
        res.status(401).json({
          errorCode: "INCORRECT_PASSWORD",
          message: "Password is not correct.",
        });
      else throw error;
    }
  }

  public async signout(req: Request, res: Response): Promise<void> {
    await this.authService.signout(req.session);
    res.status(201).end();
  }

  public async updatePassword(req: Request, res: Response): Promise<void> {
    const { userUid } = req.session;
    if (!userUid) {
      res.status(401).end();
      return;
    }

    const { current: rawCurrentPassword, new: rawNewPassword } = req.body;
    if (
      typeof rawCurrentPassword !== "string" ||
      typeof rawNewPassword !== "string"
    ) {
      res.status(400).end();
      return;
    }

    const currentPassword = UserValue.Password.verify(rawCurrentPassword);
    if (!currentPassword) {
      res.status(400).end();
      return;
    }

    const newPassword = UserValue.Password.verify(rawNewPassword);
    if (!newPassword) {
      res.status(400).end();
      return;
    }

    const success = await this.authService.updatePassword(
      userUid,
      currentPassword,
      newPassword
    );

    if (success) res.status(201).end();
    else res.status(400).end();
  }
}
