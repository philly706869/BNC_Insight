import { Router } from "express";
import { Category } from "../model/Category.js";

export const categoriesRouter = Router();

categoriesRouter.get("/", async (req, res) => {
  const categories = (await Category.findAll()).map((category) => ({
    uid: category.uid,
    name: category.name,
  }));

  res.status(200).json({ categories });
});
