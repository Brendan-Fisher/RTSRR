const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const stops = require("./api/stops");
const routes = require("./api/routes");
const edges = require("./api/edges");
const cors = require("cors");

require("dotenv").config();

const middlewares = require("./middlewares");
const api = require("./api");

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message:
      "Append /stops, /routes, or /edges to the URL to get a printout of the stored stops, routes, or edges",
  });
});

app.use("/stops", stops);
app.use("/routes", routes);
app.use("/edges", edges);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
