import { UserValue } from "@/database/values/user-values";
import { UserService } from "@/services/user-service";
import { Request, Response } from "express";

export class UserController {
  public constructor(private readonly userService: UserService) {}

  public async get(req: Request, res: Response): Promise<void> {
    const { username: rawUsername } = req.params;

    const username = UserValue.Username.verify(rawUsername);
    if (!username) {
      res.status(400).end();
      return;
    }

    const userDTO = await this.userService.get(username);

    if (userDTO) res.status(200).json(userDTO);
    else res.status(404).end();
  }

  public async patch(req: Request, res: Response): Promise<void> {}

  public async delete(req: Request, res: Response): Promise<void> {}
}
