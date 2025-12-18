//routes/index.js
const express = require("express");
const router = express.Router();
const path = require("path");

const appPkg = require(path.join(process.cwd(), "package.json"));

// Home route
router.get("/", (req, res) => {
    res.render("home", {
        title: "Home",
        appName: appPkg.name,
        appVersion: appPkg.version,
        expMvcVersion: "1.2.0",
        nodeVersion: process.version,
        expressVersion: require("express/package.json").version
    });
});

// Import and use other routes here

module.exports = router;
