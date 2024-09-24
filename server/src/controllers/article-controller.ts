import { RequestHandler } from "express";

export const postArticleHandler: RequestHandler = async (req, res) => {};

export const getArticleHandler: RequestHandler = async (req, res) => {
  const { id } = req.params;
};

export const getArticlesHandler: RequestHandler = async (req, res) => {
  const { category, offset, limit } = req.query;
  if (
    typeof category !== "string" ||
    typeof offset !== "string" ||
    typeof limit !== "string"
  ) {
    res.status(400).end();
    return;
  }
};

export const patchArticleHandler: RequestHandler = async (req, res) => {};

export const deleteArticleHandler: RequestHandler = async (req, res) => {};
