import { Router } from "express";
import Joi from "joi";
import { Category } from "../model/Category.js";

export const categoriesRouter = Router();

categoriesRouter.get("/", async (req, res) => {
  const categories = (await Category.findAll()).map(
    (category) => category.name
  );

  res.status(200).json({ categories });
});

const postSchema = Joi.object<{ value: string }>({
  value: Joi.string()
    .custom(async (value: string) => {
      const validation = Category.validateName(value);
      if (validation !== null) throw new Error();

      const category = await Category.findByPk(value);
      if (category) throw new Error();
    })
    .required(),
});

categoriesRouter.post("/", async (req, res) => {
  const validaiton = postSchema.validate(req.body);
  if (validaiton.error) {
    res.status(400).end();
    return;
  }
  const { value } = validaiton.value;

  try {
    await Category.create({ name: value });
  } catch (error) {
    res.status(500).end();
  }

  res.status(201).end();
});
