import { config } from "@/config";
import { Database } from "@/database/database";
import { authTokenTable } from "@/database/tables/auth-token-table";
import { userTable } from "@/database/tables/user-table";
import { ProtectedUserDTO } from "@/dto/protected-user-dto";
import {
  IncorrectPasswordError,
  InvalidAuthTokenError,
  UserNotFoundError,
} from "@/errors/service-errors";
import { AuthTokenValue } from "@/value-objects/auth-token-values";
import { UserValue } from "@/value-objects/user-values";
import { compare, hash } from "bcrypt";
import { eq, sql } from "drizzle-orm";
import { Session, SessionData } from "express-session";

export class AuthService {
  public constructor(private readonly database: Database) {}

  public async verifyAuthToken(value: string): Promise<{ valid: boolean }> {
    const token = AuthTokenValue.Token.verify(value);
    if (token === null) {
      return { valid: false };
    }

    const result = await this.database
      .select({ exists: sql<number>`1` })
      .from(authTokenTable)
      .where(eq(authTokenTable.token, token.value))
      .execute();

    return { valid: result.length !== 0 };
  }

  /**
   * @throws {UserNotFoundError}
   */
  public async getCurrentUser(
    session: Partial<SessionData>
  ): Promise<ProtectedUserDTO> {
    const userUid = session.userUid;
    if (userUid === undefined) {
      return Promise.reject(new UserNotFoundError());
    }

    const user = (
      await this.database
        .select({
          username: userTable.username,
          name: userTable.name,
          isAdmin: userTable.isAdmin,
          createdAt: userTable.createdAt,
        })
        .from(userTable)
        .where(eq(userTable.uid, userUid))
        .execute()
    ).at(0);

    if (user === undefined) {
      return Promise.reject(new UserNotFoundError());
    }

    return new ProtectedUserDTO({
      ...user,
      createdAt: user.createdAt.toISOString(),
    });
  }

  /**
   * @throws {InvalidAuthTokenError}
   */
  public async signup(
    session: Partial<SessionData>,
    token: AuthTokenValue.Token,
    username: UserValue.Username,
    password: UserValue.Password,
    name: UserValue.Name
  ): Promise<void> {
    await this.database.transaction(async (tx) => {
      const authToken = (
        await tx
          .select({ isAdminToken: authTokenTable.isAdminToken })
          .from(authTokenTable)
          .for("update")
          .where(eq(authTokenTable.token, token.value))
          .execute()
      ).at(0);
      if (authToken === undefined) {
        return Promise.reject(new InvalidAuthTokenError());
      }

      const user = (
        await tx
          .insert(userTable)
          .values({
            username: username.value,
            passwordHash: Buffer.from(
              await hash(password.value, config.user.passwordHashRounds)
            ),
            name: name.value,
            isAdmin: authToken.isAdminToken,
          })
          .$returningId()
          .execute()
      )[0];

      await tx
        .delete(authTokenTable)
        .where(eq(authTokenTable.token, token.value))
        .execute();

      session.userUid = user.uid;
    });
  }

  /**
   * @throws {UserNotFoundError}
   * @throws {IncorrectPasswordError}
   */
  public async signin(
    session: Partial<SessionData>,
    username: UserValue.Username,
    password: UserValue.Password
  ): Promise<void> {
    const user = (
      await this.database
        .select({
          uid: userTable.uid,
          passwordHash: userTable.passwordHash,
        })
        .from(userTable)
        .where(eq(userTable.username, username.value))
        .execute()
    ).at(0);
    if (user === undefined) {
      return Promise.reject(new UserNotFoundError());
    }

    const isCorrect = await compare(
      password.value,
      user.passwordHash.toString()
    );
    if (!isCorrect) {
      return Promise.reject(new IncorrectPasswordError());
    }

    session.userUid = user.uid;
  }

  public async signout(session: Session & Partial<SessionData>): Promise<void> {
    return new Promise((resolve, reject) => {
      session.destroy((error) => {
        if (error) reject(error);
        else resolve();
      });
    });
  }

  /**
   * @throws {UserNotFoundError}
   * @throws {IncorrectPasswordError}
   */
  public async updatePassword(
    uid: number,
    currentPassword: UserValue.Password,
    newPassword: UserValue.Password
  ): Promise<void> {
    await this.database.transaction(async (tx) => {
      const user = (
        await tx
          .select({ passwordHash: userTable.passwordHash })
          .from(userTable)
          .for("update")
          .where(eq(userTable.uid, uid))
          .execute()
      ).at(0);
      if (user === undefined) {
        return Promise.reject(new UserNotFoundError());
      }

      const isCorrect = await compare(
        currentPassword.value,
        user.passwordHash.toString()
      );
      if (!isCorrect) {
        return Promise.reject(new IncorrectPasswordError());
      }

      await tx
        .update(userTable)
        .set({
          passwordHash: Buffer.from(
            await hash(newPassword.value, config.user.passwordHashRounds)
          ),
        })
        .where(eq(userTable.uid, uid))
        .execute();
    });
  }
}
