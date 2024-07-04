import { Router } from "express";
import { categories } from "../model/categories.js";

export const categoryRouter = Router();

categoryRouter.get("/", (req, res) => res.status(200).json({ categories }));
