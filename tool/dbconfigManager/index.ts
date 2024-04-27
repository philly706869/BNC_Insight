import { select } from "@inquirer/prompts";
import initialize from "./tasks/initialize.js";
import reset from "./tasks/reset.js";

(
  await select({
    message: "Choose task to execute",
    choices: [
      {
        name: "Initialize Database",
        value: initialize,
      },
      {
        name: "Reset Database",
        value: reset,
      },
    ],
  })
)();
