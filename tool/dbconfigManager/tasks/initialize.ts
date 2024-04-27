import mysql from "mysql2/promise";
import { dbConfigPath } from "../../../server/configs/declare/dbConfig.declare.js";
import fs from "fs";
import { exit } from "process";
import { input, confirm, password as password_ } from "@inquirer/prompts";
import chalk from "chalk";

export default async function () {
  type Validate = (
    value: string
  ) => boolean | string | Promise<string | boolean>;

  const mysqlUserValidate: Validate = (input) => {
    if (input.length < 1) return "User must be longer than 0 characters";
    if (input.length > 32) return "User must be shoter than 33 characters";
    return true;
  };
  const mysqlPasswordValidate: Validate = (input) => {
    return true;
  };
  const mysqlDatabaseValidate: Validate = (input) => {
    return true;
  };
  const mysqlHostValidate: Validate = (input) => {
    return true;
  };
  const mysqlConnectionLimitValidate: Validate = (input) => {
    const numberRegex = /^\d+$/g;
    return input.match(numberRegex)
      ? true
      : "Connection limit must be natural number";
  };

  const adminUser = await input({
    message: "Enter admin user (must have CREATE, DROP permissions)",
    default: "root",
    validate: mysqlUserValidate,
  });
  const adminPassword = await password_({
    message: `Enter password for user ${adminUser}`,
    mask: "*",
    validate: mysqlPasswordValidate,
  });

  const user = await input({
    message: "Enter user",
    validate: mysqlUserValidate,
  });
  const password = await password_({
    message: `Enter password for user ${user}`,
    mask: "*",
    validate: mysqlPasswordValidate,
  });
  const confirmPassword = await password_({
    message: `Confirm password for user ${user}`,
    mask: "*",
  });
  if (password != confirmPassword) {
    console.log("Error: Password does not match");
    exit();
  }
  const database = await input({
    message: "Enter database",
    validate: mysqlDatabaseValidate,
  });
  const host = await input({
    message: `Enter host for database ${database}`,
    default: "localhost",
    validate: mysqlHostValidate,
  });
  const connectionLimit = parseInt(
    await input({
      message: `Enter connection limit for database ${database}`,
      default: "30",
      validate: mysqlConnectionLimitValidate,
    })
  );

  if (fs.existsSync(dbConfigPath)) {
    if (!fs.lstatSync(dbConfigPath).isFile()) {
      console.log(
        `Error: Config file path is duplicated with directory: \`${dbConfigPath}\``
      );
      exit();
    }

    const willOverwrite = await confirm({
      message: `Database config file already exists: \`${dbConfigPath}\`. Would you overwrite config?`,
      default: false,
    });

    if (!willOverwrite) {
      console.log("Info: Failed to initialize database configuration");
      exit();
    }
  }

  const confirmContinue = await confirm({
    message:
      `Would you initialize with the following configuration?\n` +
      `User: ${user}\n` +
      `Database: ${database}\n` +
      `Host: ${host}\n` +
      `ConnectionLimit: ${connectionLimit}\n`,
  });

  if (!confirmContinue) {
    console.log("Info: Canceled to initialize database configuration");
    exit();
  }

  const connection = await mysql.createConnection({
    user: adminUser,
    password: adminPassword,
  });

  connection.connect();

  try {
    const [selectedDB] = await connection.query(
      "SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?",
      [database]
    );
    const isDBExists = (selectedDB as any[]).length != 0;

    if (isDBExists) {
      const checkDrop = async (message: string) => {
        const condition = await confirm({ message: message });
        if (!condition) {
          console.log("Info: Canceled to initialzie database configuration");
          exit();
        }
      };
      await checkDrop(
        `Database named ${database} is already exists. World you drop the database?`
      );
      await checkDrop("Really drop the database?");
      await connection.query("DROP DATABASE " + connection.escapeId(database));
      console.log("Succeed to drop database");
    }

    await connection.query("CREATE DATABASE " + connection.escapeId(database));

    fs.writeFileSync(
      dbConfigPath,
      JSON.stringify({
        user: user,
        password: password,
        database: database,
        host: host,
        connectionLimit: connectionLimit,
      })
    );

    console.log("Succeed to initialize database");
  } finally {
    connection.end();
  }
}
