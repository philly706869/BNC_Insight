import { Router } from "express";
import { categories } from "../model/categories.js";

export const categoriesRouter = Router();

categoriesRouter.get("/", (req, res) => res.status(200).json({ categories }));
