import { dataSource } from "./dataSource";
import { Article } from "./models/Article";
import { AuthToken } from "./models/AuthToken";
import { Category } from "./models/Category";
import { Session } from "./models/Session";
import { User } from "./models/User";

export const sessionRepository = dataSource.getRepository(Session);
export const authTokenRepository = dataSource.getRepository(AuthToken);
export const userRepository = dataSource.getRepository(User);
export const categoryRepository = dataSource.getRepository(Category);
export const articleRepository = dataSource.getRepository(Article);
