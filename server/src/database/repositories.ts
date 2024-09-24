import { dataSource } from "./data-source";
import { Article } from "./entities/Article";
import { AuthToken } from "./entities/AuthToken";
import { Category } from "./entities/Category";
import { Session } from "./entities/Session";
import { User } from "./entities/User";

export const sessionRepository = dataSource.getRepository(Session);
export const authTokenRepository = dataSource.getRepository(AuthToken);
export const userRepository = dataSource.getRepository(User);
export const categoryRepository = dataSource.getRepository(Category);
export const articleRepository = dataSource.getRepository(Article);
