import { dataSource } from "./data-source";
import { Article } from "./entities/article";
import { AuthToken } from "./entities/auth-token";
import { Category } from "./entities/category";
import { Session } from "./entities/session";
import { User } from "./entities/user";

export const sessionRepository = dataSource.getRepository(Session);
export const authTokenRepository = dataSource.getRepository(AuthToken);
export const userRepository = dataSource.getRepository(User);
export const categoryRepository = dataSource.getRepository(Category);
export const articleRepository = dataSource.getRepository(Article);
