import {
  IncorrectPasswordError,
  InvalidAuthTokenError,
  InvalidUsernameError,
  UserNotFoundError,
} from "@/errors/service-errors";
import { AuthService } from "@/services/auth-service";
import { logger } from "@/utils/logger";
import { AuthTokenValueTransformer } from "@/utils/zod/auth-token-values-transformers";
import { UserValueTransformer } from "@/utils/zod/user-value-transformers";
import { Request, Response } from "express";
import { z } from "zod";

export class AuthController {
  public constructor(private readonly authService: AuthService) {}

  private static readonly verifyAuthTokenSchema = z.object({
    value: z.string(),
  });

  public async verifyAuthToken(req: Request, res: Response): Promise<void> {
    const bodyParseResult =
      await AuthController.verifyAuthTokenSchema.safeParseAsync(req.body);
    if (!bodyParseResult.success) {
      res.status(400).end();
      return;
    }
    const body = bodyParseResult.data;

    try {
      await this.authService.verifyAuthToken(body.value);
      res.status(422).end();
    } catch (error) {
      if (error instanceof InvalidAuthTokenError) {
        res.status(422).end();
      } else {
        return Promise.reject(error);
      }
    }
  }

  private static readonly verifyUsernameSchema = z.object({
    value: z.string(),
  });

  public async verifyUsername(req: Request, res: Response): Promise<void> {
    const bodyParseResult =
      await AuthController.verifyUsernameSchema.safeParseAsync(req.body);
    if (!bodyParseResult.success) {
      res.status(400).end();
      return;
    }
    const body = bodyParseResult.data;

    try {
      await this.authService.verifyUsername(body.value);
      res.status(200).end();
    } catch (error) {
      if (error instanceof InvalidUsernameError) {
        res.status(422).end();
      } else {
        return Promise.reject(error);
      }
    }
  }

  public async getCurrentUser(req: Request, res: Response): Promise<void> {
    try {
      const userDTO = await this.authService.getCurrentUser(req.session);
      res.status(200).json(userDTO);
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        req.session.destroy((error) => {
          logger.error(error);
        });
        res.status(404).end();
      } else {
        return Promise.reject(error);
      }
    }
  }

  private static readonly signupSchema = z.object({
    token: z.string().transform(AuthTokenValueTransformer.token),
    username: z.string().transform(UserValueTransformer.username),
    password: z.string().transform(UserValueTransformer.password),
    name: z.string().transform(UserValueTransformer.name),
  });

  public async signup(req: Request, res: Response): Promise<void> {
    const bodyParseResult = await AuthController.signupSchema.safeParseAsync(
      req.body
    );
    if (!bodyParseResult.success) {
      res.status(400).end();
      return;
    }
    const body = bodyParseResult.data;

    try {
      const userDTO = await this.authService.signup(
        req.session,
        body.token,
        body.username,
        body.password,
        body.name
      );
      res.status(201).json(userDTO);
    } catch (error) {
      if (error instanceof InvalidAuthTokenError) {
        res.status(422).json({
          errorCode: "INVALID_AUTH_TOKEN",
          message: "Auth token is not valid.",
        });
      } else {
        return Promise.reject(error);
      }
    }
  }

  private static readonly signinSchema = z.object({
    username: z.string().transform(UserValueTransformer.username),
    password: z.string().transform(UserValueTransformer.password),
  });

  public async signin(req: Request, res: Response): Promise<void> {
    const bodyParseResult = await AuthController.signinSchema.safeParseAsync(
      req.body
    );
    if (!bodyParseResult.success) {
      res.status(400).end();
      return;
    }
    const body = bodyParseResult.data;

    try {
      const userDTO = await this.authService.signin(
        req.session,
        body.username,
        body.password
      );
      res.status(201).json(userDTO);
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        res.status(401).json({
          errorCode: "USER_NOT_FOUND",
          message: "User is not found.",
        });
      } else if (error instanceof IncorrectPasswordError) {
        res.status(401).json({
          errorCode: "INCORRECT_PASSWORD",
          message: "Password is not correct.",
        });
      } else {
        return Promise.reject(error);
      }
    }
  }

  public async signout(req: Request, res: Response): Promise<void> {
    await this.authService.signout(req.session);
    res.status(201).end();
  }

  private static readonly updatePasswordSchema = z.object({
    currentPassword: z.string().transform(UserValueTransformer.password),
    newPassword: z.string().transform(UserValueTransformer.password),
  });

  public async updatePassword(req: Request, res: Response): Promise<void> {
    const userUid = req.session.userUid;
    if (userUid === undefined) {
      res.status(401).end();
      return;
    }

    const bodyParseResult =
      await AuthController.updatePasswordSchema.safeParseAsync(req.body);
    if (!bodyParseResult.success) {
      res.status(400).end();
      return;
    }
    const body = bodyParseResult.data;

    try {
      await this.authService.updatePassword(
        userUid,
        body.currentPassword,
        body.newPassword
      );
      res.status(201).end();
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        res.status(400).end();
      } else if (error instanceof IncorrectPasswordError) {
        res.status(401).end();
      } else {
        return Promise.reject(error);
      }
    }
  }
}
