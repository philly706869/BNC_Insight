import mysql from "mysql2";
import readline from "readline-sync";
import { dbConfigPath } from "./server/configs/declare/dbConfig.declare.js";
import fs from "fs";

if (fs.existsSync(dbConfigPath)) {
  const metadata = fs.lstatSync(dbConfigPath);
  if (metadata.isFile()) {
    const answer = readline.question(
      `Database config file already exists: ${dbConfigPath}. Will you override config file? [y/n] > `,
      {
        limit: ["y", "yes", "n", "no"],
      }
    );
  } else if (metadata.isDirectory()) {
  } else {
    throw Error("unknown error");
  }
}

const initializerUser = readline.question(
  "enter user for initialize  (default: root) > "
);
const initializerPassword = readline.question(
  "enter password for initialize > ",
  {
    mask: "●",
    hideEchoBack: true,
    min: 1,
  }
);
const host = readline.question("enter host for server access > ", { min: 1 });
const user = readline.question("enter user for server access > ", { min: 1 });
const database = readline.question("enter database for server access > ", {
  min: 1,
});

const connection = mysql.createConnection({
  user: initializerUser.length == 0 ? "root" : initializerUser,
  password: initializerPassword,
});

connection.connect();

try {
  let isDBExists: boolean;

  connection.query(
    "SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?",
    [database],
    (error, results, fields) => {
      if (error) throw error;
      isDBExists = (results as any[]).length == 0;
    }
  );
  if (isDBExists) {
    readline.questionInt(
      `Database named ${database} is already exists. To initialize `
    );
  }

  connection.query(
    "CREATE DATABASE " + connection.escapeId(database),
    (error, results, fields) => {
      if (error) throw error;
    }
  );

  connection.query("show databases", (error, results, fields) => {
    if (error) throw error;
    console.log(results);
  });
} finally {
  connection.end();
}
