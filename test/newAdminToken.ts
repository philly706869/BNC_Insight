import { exit } from "process";
import { sequelize, AuthToken } from "../src/model/sequelize.js";
import { input } from "@inquirer/prompts";

await sequelize.sync();

const token = await input({
  message: "Enter Token > ",
  validate: (value) => {
    return value.length > 0 && value.length <= 128;
  },
});

await AuthToken.create({
  token: token,
  isAdminToken: true,
});

console.log("succeed");

exit();
