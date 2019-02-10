const express = require("express");
const api = require("./api");
const user = require("./user");
const baxios = require("./baxios");

const server = express();
const port = 3000;

server.get("/", (req, res) => res.send("Hello World!"));

// Use Routes
server.use("/api/", api);
server.use("/user/", user);
server.use("/baxios/", baxios);

server.listen(port, () =>
  console.log(`Example app running on: http://localhost:${port}!`)
);
