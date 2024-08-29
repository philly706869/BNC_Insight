import nodemon from "nodemon";

nodemon({
  script: "index.ts",
  watch: ["server"],
  ext: "ts",
  exec: "tsc && cross-env NODE_ENV=development tsx server/index.ts",
}).on("log", ({ colour }) => console.log(colour));
