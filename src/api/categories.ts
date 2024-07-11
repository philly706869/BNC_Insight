import { Router } from "express";
import Joi from "joi";
import { Category } from "../model/Category.js";
import { logger } from "../util/logger.js";

export const categoriesRouter = Router();

categoriesRouter.get("/", async (req, res) => {
  try {
    const categories = (await Category.findAll()).map(
      (category) => category.name
    );

    res.status(200).json({ categories });
  } catch (error) {
    logger.error(error);
    res.status(500).end();
  }
});

const bodySchema = Joi.object<{ value: string }>({
  value: Joi.string()
    .external(async (value: string, helper) => {
      if (Category.validateName(value) !== null) return helper.message({});
      if (await Category.findByPk(value)) return helper.message({});
      return value;
    })
    .required(),
}).unknown(true);

categoriesRouter.post("/", async (req, res) => {
  try {
    const body = await bodySchema.validateAsync(req.body);
    const { value } = body;

    try {
      await Category.create({ name: value });
    } catch (error) {
      res.status(500).end();
    }

    res.status(201).end();
  } catch (error) {
    if (Joi.isError(error)) res.status(400).end();
    else {
      logger.error(error);
      res.status(500).end();
    }
  }
});
