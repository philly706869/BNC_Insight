import { Router } from "express";
import { Category } from "../model/Category.js";
import { validationHandler } from "./validationHandler.js";
import { valueValidator } from "./valueValidator.js";

export const categoriesRouter = Router();

categoriesRouter.get("/", async (req, res) => {
  const categories = (await Category.findAll()).map(
    (category) => category.name
  );

  res.status(200).json({ categories });
});

categoriesRouter.post(
  "/",
  valueValidator.custom(async (value: string) => {
    const validation = Category.validateName(value);
    if (validation !== null)
      throw { error: "INVALID_CATEGORY_NAME", messages: validation };
    const category = await Category.findByPk(value);
    if (category)
      throw {
        error: "CATEGORY_ALREADY_EXISTS",
        message: `Category named \`${value}\` already exists`,
      };
  }),
  validationHandler,
  async (req, res) => {
    const value: string = req.body.value;

    try {
      await Category.create({ name: value });
    } catch (error) {
      res
        .status(500)
        .error({
          errors: [
            { error: "UNKNOWN_ERROR", message: "Failed to create category." },
          ],
        });
    }

    res.status(201).end();
  }
);
