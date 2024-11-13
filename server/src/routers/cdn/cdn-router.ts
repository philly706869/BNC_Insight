import { ResourceNotFoundError } from "@errors/router-error";
import { responsibleErrorHandler } from "@middlewares/responsible-error-handler";
import { imageRouter } from "@routers/cdn/image-router";
import { Router } from "express";

export const cdnRouter = Router();
cdnRouter.use("/images", imageRouter);
cdnRouter.use((req, res, next) => {
  next(new ResourceNotFoundError());
});
cdnRouter.use(responsibleErrorHandler);
