import { User } from "@/models/User";
import { hash } from "bcrypt";
import { SessionData } from "express-session";
import { AuthTokenFindException, findAuthToken } from "./authTokenService";
import {
  UserIdVerificationErrorCode,
  UserNameVerificationErrorCode,
  UserPasswordVerificationErrorCode,
  verifyUserIdFormat,
  verifyUserNameFormat,
  verifyUserPasswordFormat,
} from "./verificationService";

type UserCreationError<ErrorCode extends string, DetailCode extends string> = {
  errorCode: ErrorCode;
  detailCode: DetailCode;
};

type UserCreationErrors =
  | UserCreationError<"INVALID_AUTH_TOKEN", "INVALID_AUTH_TOKEN">
  | UserCreationError<"INVALID_ID", UserIdVerificationErrorCode | "ID_EXISTS">
  | UserCreationError<"INVALID_PASSWORD", UserPasswordVerificationErrorCode>
  | UserCreationError<"INVALID_NAME", UserNameVerificationErrorCode>;

export class UserCreationException {
  declare error: UserCreationErrors;
  constructor(error: UserCreationErrors) {
    this.error = error;
  }
}

export async function createUser(
  token: string,
  id: string,
  password: string,
  name: string,
  isAdmin: boolean = false
): Promise<User | null> {
  try {
    const authToken = await findAuthToken(token);
    if (!authToken)
      throw new UserCreationException({
        errorCode: "INVALID_AUTH_TOKEN",
        detailCode: "INVALID_AUTH_TOKEN",
      });

    if (await findUserById(id))
      throw new UserCreationException({
        errorCode: "INVALID_ID",
        detailCode: "ID_EXISTS",
      });

    const passwordVerificationResult = verifyUserPasswordFormat(password);
    if (passwordVerificationResult.error)
      throw new UserCreationException({
        errorCode: "INVALID_PASSWORD",
        detailCode: passwordVerificationResult.errorCode,
      });

    const nameVerificationResult = verifyUserNameFormat(name);
    if (nameVerificationResult.error)
      throw new UserCreationException({
        errorCode: "INVALID_NAME",
        detailCode: nameVerificationResult.errorCode,
      });

    await authToken.remove();
    const user = new User();
    user.id = id;
    user.passwordHash = Buffer.from(await hash(password, 10));
    user.name = name;
    user.isAdmin = isAdmin;
    return await user.save();
  } catch (error) {
    if (error instanceof AuthTokenFindException)
      throw new UserCreationException({
        errorCode: "INVALID_AUTH_TOKEN",
        detailCode: "INVALID_AUTH_TOKEN",
      });
    if (error instanceof UserFindException)
      throw new UserCreationException({
        errorCode: "INVALID_ID",
        detailCode: error.errorCode,
      });
    throw error;
  }
}

export async function findUserByUid(uid: number): Promise<User | null> {
  return await User.findOne({ where: { uid } });
}

export async function findUserByUuid(uuid: string): Promise<User | null> {
  return await User.findOne({ where: { uuid } });
}

export class UserFindException {
  declare errorCode: UserIdVerificationErrorCode;
  constructor(errorCode: UserIdVerificationErrorCode) {
    this.errorCode = errorCode;
  }
}

export async function findUserById(id: string): Promise<User | null> {
  const idVerificationResult = verifyUserIdFormat(id);
  if (idVerificationResult.error)
    throw new UserFindException(idVerificationResult.errorCode);
  return await User.findOne({ where: { id } });
}

export type CurrentUser = Pick<
  User,
  "uuid" | "id" | "name" | "isAdmin" | "createdAt"
>;

export async function getCurrentUser(
  session: Partial<SessionData>
): Promise<CurrentUser | null> {
  const { userUid } = session;
  if (!userUid) return null;
  const user = await findUserByUid(userUid);
  if (!user) return null;
  return {
    uuid: user.uuid,
    id: user.id,
    name: user.name,
    isAdmin: user.isAdmin,
    createdAt: user.createdAt,
  };
}
