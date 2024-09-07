import { createContext } from "react";
import { CurrentUser } from "../types/User";

export const CurrentUserContext = createContext<CurrentUser | null | undefined>(
  undefined
);
