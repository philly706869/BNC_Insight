import express from "express";
import config from "../configs/serverConfig.js";
import apiRouter from "./routers/api/apiRouter.js";
import siteRouter from "./routers/site/siteRouter.js";
import logger from "./util/logger.js";

const app = express();

app.use(config.static.route, express.static(config.static.dir));
app.use(config.apiRoute, apiRouter);
app.use("/", siteRouter);

app.listen(config.port, () => {
  logger.info(`http server started listening on port ${config.port}`);
});
