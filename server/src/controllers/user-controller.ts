import { UserNotFoundError } from "@/errors/service-errors";
import { UserService } from "@/services/user-service";
import { UserValueTransformer } from "@/utils/zod/user-value-transformers";
import { Request, Response } from "express";
import { z } from "zod";

export class UserController {
  public constructor(private readonly userService: UserService) {}

  private static readonly paramsSchema = z.object({
    username: z.string().transform(UserValueTransformer.username),
  });

  public async get(req: Request, res: Response): Promise<void> {
    const paramsParseResult = await UserController.paramsSchema.safeParseAsync(
      req.params
    );
    if (!paramsParseResult.success) {
      res.status(400).end();
      return;
    }
    const params = paramsParseResult.data;

    try {
      const userDTO = await this.userService.get(params.username);
      res.status(200).json(userDTO);
    } catch (error) {
      if (error instanceof UserNotFoundError) res.status(404).end();
      else return Promise.reject(error);
    }
  }

  private static readonly patchSchema = z.object({
    username: z.string().transform(UserValueTransformer.username).optional(),
    name: z.string().transform(UserValueTransformer.name).optional(),
  });

  public async patch(req: Request, res: Response): Promise<void> {
    const userUid = req.session.userUid;
    if (!userUid) {
      res.status(401).end();
      return;
    }

    const bodyParseResult = await UserController.patchSchema.safeParseAsync(
      req.body
    );
    if (!bodyParseResult.success) {
      res.status(400).end();
      return;
    }
    const body = bodyParseResult.data;

    try {
      await this.userService.patch(userUid, body);
      res.status(201).end();
    } catch (error) {
      if (error instanceof UserNotFoundError) res.status(500).end();
      else return Promise.reject(error);
    }
  }

  public async delete(req: Request, res: Response): Promise<void> {
    const userUid = req.session.userUid;
    if (!userUid) {
      res.status(401).end();
      return;
    }

    try {
      await this.userService.delete(userUid);
      res.status(201).end();
    } catch (error) {
      if (error instanceof UserNotFoundError) res.status(500).end();
      else return Promise.reject(error);
    }
  }
}
