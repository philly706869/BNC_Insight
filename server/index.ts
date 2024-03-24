import express from "express";
import config from "../config";
import apiRouter from "./api/apiRouter";
import mainRouter from "./mainRouter";

const app = express();

app.use(config.static.route, express.static(config.static.dir));
app.use(config.apiRoute, apiRouter);
app.use("/", mainRouter);

app.listen(config.port, () => {
  console.log(`server started on port: ${config.port}`);
});

console.log(config.jwtsecret);
