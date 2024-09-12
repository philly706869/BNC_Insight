import { createContext } from "react";
import { CurrentUser } from "../types/User";

export type CurrentUserContextData =
  | { isInitialized: false }
  | { isInitialized: true; data: CurrentUser | null };
export const CurrentUserContext = createContext<CurrentUserContextData>({
  isInitialized: false,
});
