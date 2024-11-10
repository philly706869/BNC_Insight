import { createContext } from "react";
import { Category } from "../services/category-service";

export type CategoryContextData =
  | { isInitialized: false }
  | { isInitialized: true; data: Category[] };
export const CategoryContext = createContext<CategoryContextData>({
  isInitialized: false,
});
