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

const bodySchema = Joi.object<{ value: string }>({
  value: Joi.string().required(),
});

categoriesRouter.post("/", async (req, res) => {
  const validation = bodySchema.validate(req.body);
  if (validation.error) {
    res.status(400).error({ errors: [{ error: "", message: "" }] });
    return;
  }
  const { value } = validation.value;

  const nameValidation = Category.validateName(value);
  if (nameValidation !== null) {
    res.status(400).error({ errors: [{ error: "", message: "" }] });
    return;
  }

  if ((await Category.findByPk(value)) !== null) {
    res.status(400).error({ errors: [{ error: "", message: "" }] });
    return;
  }

  try {
    await Category.create({ name: value });
  } catch (error) {
    res.status(500).error({ errors: [{ error: "", message: "" }] });
  }

  res.status(201).end();
});
