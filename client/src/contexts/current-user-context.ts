import { createContext } from "react";
import { ProtectedUser } from "../services/auth-service";

export type CurrentUserContextData = ProtectedUser | null | undefined;
export const CurrentUserContext =
  createContext<CurrentUserContextData>(undefined);
