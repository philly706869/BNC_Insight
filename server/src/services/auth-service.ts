import { Database } from "@/database/database";
import { authTokens } from "@/database/tables/auth-token";
import { users } from "@/database/tables/user";
import { AuthTokenValue } from "@/database/values/auth-token-values";
import { UserValue } from "@/database/values/user-values";
import { ProtectedUserDTO } from "@/dto/protected-user-dto";
import {
  IncorrectPasswordError,
  UserNotFoundError,
} from "@/errors/service-errors";
import { hashPassword } from "@/utils/hashPassword";
import { compare } from "bcrypt";
import { eq, sql } from "drizzle-orm";
import { Session, SessionData } from "express-session";

export class AuthService {
  public constructor(private readonly database: Database) {}

  public async verifyAuthToken(
    authToken: AuthTokenValue.Token
  ): Promise<boolean> {
    const result = await this.database
      .select({ exists: sql<number>`1` })
      .from(authTokens)
      .where(eq(authTokens.token, authToken.value))
      .execute();
    return Boolean(result.length);
  }

  public async verifyUsername(username: UserValue.Username): Promise<boolean> {
    const result = await this.database
      .select({ exists: sql<number>`1` })
      .from(users)
      .where(eq(users.username, username.value))
      .execute();
    return Boolean(result.length);
  }

  /**
   * @throws {UserNotFoundError}
   */
  public async getCurrentUser(
    session: Partial<SessionData>
  ): Promise<ProtectedUserDTO> {
    const { userUid } = session;
    if (!userUid) return Promise.reject(new UserNotFoundError());
    const userArray = await this.database
      .select({
        username: users.username,
        name: users.name,
        isAdmin: users.isAdmin,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.uid, userUid))
      .execute();

    if (!userArray.length) return Promise.reject(new UserNotFoundError());
    const user = userArray[0];

    return new ProtectedUserDTO({
      ...user,
      createdAt: user.createdAt.toISOString(),
    });
  }

  public async signup(
    session: Partial<SessionData>,
    token: AuthTokenValue.Token,
    username: UserValue.Username,
    password: UserValue.Password,
    name: UserValue.Name
  ): Promise<void> {
    session.userUid = await this.database.transaction(async (tx) => {
      const tokenArray = await tx
        .select({ isAdminToken: authTokens.isAdminToken })
        .from(authTokens)
        .for("update")
        .where(eq(authTokens.token, token.value))
        .execute();
      if (!tokenArray.length) tx.rollback();
      const { isAdminToken } = tokenArray[0];

      const userArray = await tx
        .insert(users)
        .values({
          username: username.value,
          passwordHash: await hashPassword(password),
          name: name.value,
          isAdmin: isAdminToken,
        })
        .$returningId()
        .execute();

      await tx
        .delete(authTokens)
        .where(eq(authTokens.token, token.value))
        .execute();

      return userArray[0].uid;
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
  ): Promise<ProtectedUserDTO> {
    const user = await this.userRepository.findOne({
      where: { username: username.value },
      select: { uid: true, passwordHash: true },
    });
    if (!user) return Promise.reject(new UserNotFoundError());

    if (!(await compare(password.value, user.passwordHash.toString())))
      return Promise.reject(new IncorrectPasswordError());

    session.userUid = user.uid;

    return ProtectedUserDTO.from(user);
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
    const user = await this.userRepository.findOne({
      where: { uid },
      select: { passwordHash: true },
    });
    if (!user) return Promise.reject(new UserNotFoundError());

    const isCorrect = await compare(
      currentPassword.value,
      user.passwordHash.toString()
    );
    if (!isCorrect) return Promise.reject(new IncorrectPasswordError());

    const result = await this.userRepository.update(
      { uid },
      { passwordHash: await hashPassword(newPassword) }
    );
    if (!Boolean(result.affected))
      return Promise.reject(new UserNotFoundError());

    return;
  }
}
