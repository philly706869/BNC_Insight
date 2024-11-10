import { createContext } from "react";
import { Category } from "../services/category-service";

export type CategoryContextData = Category[] | undefined;
export const CategoryContext = createContext<CategoryContextData>(undefined);
