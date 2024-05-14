import { select } from "@inquirer/prompts";
import { exit } from "process";
import chalk from "chalk";
import initialize from "./tasks/initialize.js";
import reset from "./tasks/reset.js";
import modify from "./tasks/modify.js";

(
  await select({
    message: "Choose task to execute",
    choices: [
      {
        name: "Initialize Configuration",
        value: initialize,
      },
      {
        name: "Modify Configuration",
        value: modify,
      },
      {
        name: "Reset Database",
        value: reset,
      },
      {
        name: "Exit",
        value: () => {
          console.log(chalk.bold("> Exit Complete"));
          exit();
        },
      },
    ],
  })
)();
