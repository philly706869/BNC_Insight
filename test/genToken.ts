import { input, select } from "@inquirer/prompts";
import { exit } from "process";
import { AuthToken } from "../src/model/AuthToken.js";
import { sequelize } from "../src/model/sequelize.js";

await sequelize.sync();

const token = await input({
  message: "Enter token > ",
  validate: (value) => {
    return value.length > 0 && value.length <= 128;
  },
});

const isAdminToken = await select({
  message: "Enter is admin token > ",
  choices: [
    { name: "False", value: false },
    { name: "True", value: true },
  ],
});

await AuthToken.create({ token, isAdminToken });

console.log("succeed");

exit();
