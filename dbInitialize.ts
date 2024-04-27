import mysql from "mysql2";
import readline from "readline/promises";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("enter host > ");
rl.question("enter user > ");
rl.question("enter password > ", {
  mask: "●",
  hideEchoBack: true,
});

console.log(host);
console.log(user);
console.log(password);

// const connection = mysql.createConnection({
//   host: "",
//   user: "",
//   password: "",
// });

// connection.connect();

// connection.query(
//   "create database if not exists test",
//   (error, results, fields) => {
//     if (error) console.log(error);
//   }
// );

// connection.query("show databases", (error, results, fields) => {
//   if (error) console.log(error);
//   console.log(results);
// });

// connection.end();
