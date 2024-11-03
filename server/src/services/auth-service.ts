import { config } from "@/config";
import { Database } from "@/database/database";
import { authTokenTable } from "@/database/tables/auth-token-table";
import { userTable } from "@/database/tables/user-table";
import { ProtectedUserDTO } from "@/dto/protected-user-dto";
import {
  IncorrectPasswordError,
  InvalidAuthTokenError,
  InvalidUsernameError,
  UsernameAlreadyTakenError,
  UserNotFoundError,
} from "@/errors/service-errors";
import { logger } from "@/utils/logger";
import { AuthTokenValue } from "@/value-objects/auth-token-values";
import { UserValue } from "@/value-objects/user-values";
import { compare, hash } from "bcrypt";
import { eq, sql } from "drizzle-orm";
import { Session, SessionData } from "express-session";

export class AuthService {
  public constructor(private readonly database: Database) {}

  public async verifyAuthToken(value: string): Promise<boolean> {
    const tokenVerifyResult = AuthTokenValue.Token.verify(value);
    if (!tokenVerifyResult.valid) {
      return false;
    }

    const result = await this.database
      .select({ exists: sql<number>`1` })
      .from(authTokenTable)
      .where(eq(authTokenTable.token, tokenVerifyResult.data.value))
      .execute();

    return result.length !== 0;
  }

  public async getCurrentUser(
    session: Session & Partial<SessionData>
  ): Promise<ProtectedUserDTO | null> {
    const userUid = session.userUid;
    if (userUid === undefined) {
      return null;
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
      session.destroy((error) => {
        if (error) {
          logger.error(error);
        }
      });
      return null;
    }

    return new ProtectedUserDTO({
      ...user,
      createdAt: user.createdAt.toISOString(),
    });
  }

  /**
   * @throws {InvalidAuthTokenError}
   * @throws {UsernameAlreadyTakenError}
   */
  public async signup(
    session: Partial<SessionData>,
    token: string,
    username: UserValue.Username,
    password: UserValue.Password,
    name: UserValue.Name
  ): Promise<void> {
    await this.database.transaction(
      async (tx) => {
        const verifiedToken = AuthTokenValue.Token.verify(token);
        if (!verifiedToken.valid) {
          return Promise.reject(new InvalidAuthTokenError());
        }

        const authToken = (
          await tx
            .select({ isAdminToken: authTokenTable.isAdminToken })
            .from(authTokenTable)
            .for("update")
            .where(eq(authTokenTable.token, verifiedToken.data.value))
            .execute()
        ).at(0);
        if (authToken === undefined) {
          return Promise.reject(new InvalidAuthTokenError());
        }

        const existsUser = (
          await tx
            .select({ exists: sql<number>`1` })
            .from(userTable)
            .for("update")
            .where(eq(userTable.username, username.value))
            .execute()
        ).at(0);
        if (existsUser !== undefined) {
          return Promise.reject(new UsernameAlreadyTakenError());
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
          .where(eq(authTokenTable.token, verifiedToken.data.value))
          .execute();

        session.userUid = user.uid;
      },
      {
        isolationLevel: "repeatable read",
      }
    );
  }

  /**
   * @throws {InvalidUsernameError}
   * @throws {IncorrectPasswordError}
   */
  public async signin(
    session: Partial<SessionData>,
    username: string,
    password: string
  ): Promise<void> {
    const user = (
      await this.database
        .select({
          uid: userTable.uid,
          passwordHash: userTable.passwordHash,
        })
        .from(userTable)
        .where(eq(userTable.username, username))
        .execute()
    ).at(0);
    if (user === undefined) {
      return Promise.reject(new InvalidUsernameError());
    }

    const isCorrect = await compare(password, user.passwordHash.toString());
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
    currentPassword: string,
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
        currentPassword,
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
