import { input } from "@inquirer/prompts";
import { exit } from "process";
import { AuthToken } from "../src/model/AuthToken.js";
import { sequelize } from "../src/model/sequelize.js";

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
