import { RequestHandler } from "express";

export const getArticlesHandler: RequestHandler = async (req, res) => {
  const { category } = req.params;
};
