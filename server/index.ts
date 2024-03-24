import express from "express";
import config from "../config";
import apiRouter from "./api/apiRouter";
import mainRouter from "./mainRouter";

const app = express();

app.use(config.static.route, express.static(config.static.dir)); // add static middleware
app.use(config.apiRoute, apiRouter); // use apiRouter for api
app.use("/", mainRouter);

app.listen(config.port, () => {
  console.log(`https server started on port: ${config.port}`);
});
