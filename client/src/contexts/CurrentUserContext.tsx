import { createContext } from "react";
import { ProtectedUser } from "../services/auth-service";

export type CurrentUserContextData =
  | { isInitialized: false }
  | { isInitialized: true; data: ProtectedUser | null };
export const CurrentUserContext = createContext<CurrentUserContextData>({
  isInitialized: false,
});
