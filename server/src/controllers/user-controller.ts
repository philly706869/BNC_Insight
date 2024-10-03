import { User } from "@/database/entities/user";
import { UserService } from "@/services/user-service";
import { Request, Response } from "express";

export class UserController {
  public constructor(private readonly userService: UserService) {}

  public async get(req: Request, res: Response): Promise<void> {
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
  }

  public async patch(req: Request, res: Response): Promise<void> {}

  public async delete(req: Request, res: Response): Promise<void> {}
}
