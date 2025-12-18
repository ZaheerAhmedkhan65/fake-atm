// src/middlewares/errorHandler.js
module.exports = (err, req, res, next) => {
    console.error("🔥 Error:", err);

    const statusCode = err.status || 500;

    res.status(statusCode).render("error", {
        statusCode,
        title:"ERROR",
        message: err.message || "Internal Server Error",
        path: req.originalUrl,
        suggestions: [
            "Check server logs for details",
            "Validate request payload",
            "Check database connection",
            "Handle errors using try/catch"
        ]
    });
};
