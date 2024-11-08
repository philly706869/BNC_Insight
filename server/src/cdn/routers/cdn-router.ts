import { ResourceNotFoundError } from "@/errors/router-error";
import { responsibleErrorHandler } from "@/middlewares/responsible-error-handler";
import { Router } from "express";
import { imageRouter } from "./image-router";

export const cdnRouter = Router();
cdnRouter.use("/images", imageRouter);
cdnRouter.use((req, res, next) => {
  next(new ResourceNotFoundError());
});
cdnRouter.use(responsibleErrorHandler);
