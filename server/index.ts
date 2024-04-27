import express from "express";
import config from "./configs/serverConfig.js";
import apiRouter from "./api/apiRouter.js";
import mainRouter from "./mainRouter.js";
import bodyParser from "body-parser";

const app = express();

app.use(config.static.route, express.static(config.static.dir));
app.use(config.apiRoute, apiRouter);
app.use("/", mainRouter);

app.listen(config.port, () => {
  console.log(`server started on port: ${config.port}`);
});
