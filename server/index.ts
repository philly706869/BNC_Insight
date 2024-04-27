import express from "express";
import config from "./configs/serverConfig";
import apiRouter from "./api/apiRouter";
import mainRouter from "./mainRouter";
import bodyParser from "body-parser";

const app = express();

app.use(config.static.route, express.static(config.static.dir));
app.use(config.apiRoute, apiRouter);
app.use("/", mainRouter);

app.listen(config.port, () => {
  console.log(`server started on port: ${config.port}`);
});
