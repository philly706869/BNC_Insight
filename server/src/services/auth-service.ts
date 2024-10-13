import { dataSource } from "@/database/data-source";
import { AuthToken } from "@/database/entities/auth-token";
import { User } from "@/database/entities/user";
import { AuthTokenValue } from "@/database/values/auth-token-values";
import { UserValue } from "@/database/values/user-values";
import {
  ProtectedUserDTO,
  protectedUserFindSelection,
} from "@/dto/protected-user-dto";
import { hashPassword } from "@/utils/hashPassword";
import { compare } from "bcrypt";
import { Session, SessionData } from "express-session";
import { DataSource, Repository } from "typeorm";

export class InvalidAuthTokenError extends Error {}
export class UserNotFoundError extends Error {}
export class IncorrectPasswordError extends Error {}

export class AuthService {
  private readonly authTokenRepository: Repository<AuthToken>;
  private readonly userRepository: Repository<User>;

  public constructor(private readonly dataSource: DataSource) {
    this.authTokenRepository = dataSource.getRepository(AuthToken);
    this.userRepository = dataSource.getRepository(User);
  }

  public async verifyAuthToken(value: string): Promise<boolean> {
    const token = AuthTokenValue.Token.verify(value);
    if (token === null) return false;
    if (await this.authTokenRepository.existsBy({ token: token.value }))
      return true;
    return false;
  }

  public async verifyUsername(value: string): Promise<boolean> {
    const username = UserValue.Username.verify(value);
    if (username === null) return false;
    if (await this.userRepository.existsBy({ username: username.value }))
      return false;
    return true;
  }

  public async getCurrentUser(
    session: Partial<SessionData>
  ): Promise<ProtectedUserDTO | null> {
    const { userUid } = session;
    if (!userUid) return null;
    const user = await this.userRepository.findOne({
      where: { uid: userUid },
      select: protectedUserFindSelection,
    });
    return user ? ProtectedUserDTO.from(user) : null;
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
  ): Promise<ProtectedUserDTO> {
    const authToken = await this.authTokenRepository.findOne({
      where: { token: token.value },
      select: { token: true, isAdminToken: true },
    });
    if (!authToken) return Promise.reject(new InvalidAuthTokenError());

    const user = await dataSource.transaction(async (manager) => {
      await manager.delete(AuthToken, authToken);
      const user = manager.create(User, {
        username: username.value,
        passwordHash: await hashPassword(password),
        name: name.value,
        isAdmin: authToken.isAdminToken,
      });
      return await manager.save(user);
    });

    session.userUid = user.uid;

    return ProtectedUserDTO.from(user);
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

  public async updatePassword(
    uid: number,
    currentPassword: UserValue.Password,
    newPassword: UserValue.Password
  ): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { uid },
      select: { passwordHash: true },
    });
    if (!user) return false;
    if (!(await compare(currentPassword.value, user.passwordHash.toString())))
      return false;
    const result = await this.userRepository.update(
      { uid },
      { passwordHash: await hashPassword(newPassword) }
    );
    return Boolean(result.affected);
  }
}
