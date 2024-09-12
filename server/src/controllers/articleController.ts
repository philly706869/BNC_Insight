import { RequestHandler } from "express";

export const postArticleHandler: RequestHandler = async (req, res) => {};

export const getArticleHandler: RequestHandler = async (req, res) => {
  const { id } = req.params;
};

export const patchArticleHandler: RequestHandler = async (req, res) => {};

export const deleteArticleHandler: RequestHandler = async (req, res) => {};
