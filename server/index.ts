import express from "express";
import config from "../config/config.js";
import apiRouter from "./routers/api/apiRouter.js";
import siteRouter from "./routers/site/siteRouter.js";
import logger from "./util/logger.js";
import path from "path";
import { path as approot } from "./util/appRootPath.js";

const app = express();

app.use("/static", express.static(path.join(approot, "/public/static")));
app.use("/api", apiRouter);
app.use("/", siteRouter);

app.listen(config.port, () => {
  logger.info(`http server started listening on port ${config.port}`);
});
