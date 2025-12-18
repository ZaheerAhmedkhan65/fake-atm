// config/app.js
const express = require("express");
const morgan = require("morgan");
const methodOverride = require("method-override");
const expressLayouts = require("express-ejs-layouts");
const routes = require("../src/routes/index");
const notFound = require("../src/middlewares/notFound");
const errorHandler = require("../src/middlewares/errorHandler");
const path = require("path");

const app = express();

app.use(methodOverride("_method"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use(
    "/assets",
    express.static(path.join(__dirname, "../src/assets"))
);

app.set("views", path.join(__dirname, "../src/views"));
app.set("view engine", "ejs");
app.use(expressLayouts);

app.set("layout", "layouts/application");

// API Routes
app.use("/", routes);

// 404 handler (NO route matched)
app.use(notFound);

// Error handler (ANY error)
app.use(errorHandler);

module.exports = app;
