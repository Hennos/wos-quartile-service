const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const quartiles = require("./quartiles");

const indexRouter = require("./routes/index");
const quartilesRouter = require("./routes/quartiles");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(quartiles(path.join(__dirname, "data", "collection.xlsx")));

app.use("/", indexRouter);
app.use("/quartiles", quartilesRouter);

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Error");
});

module.exports = app;
