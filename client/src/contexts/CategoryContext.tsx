import { createContext } from "react";

export type CategoryContextData =
  | { isInitialized: false }
  | { isInitialized: true; data: string[] };
export const CategoryContext = createContext<CategoryContextData>({
  isInitialized: false,
});
