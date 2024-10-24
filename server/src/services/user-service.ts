import { Database } from "@/database/database";
import { userTable } from "@/database/tables/user-table";
import { UserValue } from "@/database/values/user-values";
import { PublicUserDTO } from "@/dto/public-user-dto";
import { UserNotFoundError } from "@/errors/service-errors";
import { eq } from "drizzle-orm";

export class UserService {
  public constructor(private readonly database: Database) {}

  /**
   * @throws {UserNotFoundError}
   */
  public async get(username: UserValue.Username): Promise<PublicUserDTO> {
    const user = (
      await this.database
        .select({
          username: userTable.username,
          name: userTable.name,
        })
        .from(userTable)
        .where(eq(userTable.username, username.value))
        .execute()
    ).at(0);

    if (user === undefined) {
      return Promise.reject(new UserNotFoundError());
    }

    return new PublicUserDTO(user);
  }

  /**
   * @throws {UserNotFoundError}
   */
  public async patch(
    uid: number,
    data: { username?: UserValue.Username; name?: UserValue.Name }
  ): Promise<void> {
    const [header] = await this.database
      .update(userTable)
      .set({
        username: data.username?.value,
        name: data.name?.value,
      })
      .where(eq(userTable.uid, uid))
      .execute();

    if (header.affectedRows === 0) {
      return Promise.reject(new UserNotFoundError());
    }
  }

  /**
   * @throws {UserNotFoundError}
   */
  public async delete(uid: number): Promise<void> {
    const [header] = await this.database
      .delete(userTable)
      .where(eq(userTable.uid, uid))
      .execute();

    if (header.affectedRows === 0) {
      return Promise.reject(new UserNotFoundError());
    }
  }
}
