import express from "express";
import http from "http";
import path from "path";
import { api } from "./api/api.js";
import { config } from "./config/server.config.js";
import { sequelize } from "./model/sequelize.js";
import { __dirname } from "./util/__dirname.js";
import { logger } from "./util/logger.js";

const app = express();

app.use("/static", express.static(path.join(__dirname, "./public/static")));
app.use("/api", api);
app.use(
  "/",
  express.static(path.join(__dirname, "./public/page"), {
    extensions: ["html", "htm"],
  })
);

const server = http.createServer(app);

server.listen(config.port, async () => {
  logger.info(`http server started listening on port ${config.port}`);

  try {
    await sequelize.sync();
    logger.info("database sync succeed");
  } catch (error) {
    logger.error(error);
  }
});
