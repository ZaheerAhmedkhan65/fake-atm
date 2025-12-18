// src/middlewares/notFound.js
module.exports = (req, res, next) => {
    res.status(404).render("error", {
        statusCode: 404,
        title:"ERROR",
        message: "Route not found",
        path: req.originalUrl,
        suggestions: [
            "Check the URL spelling",
            "Make sure the route exists in src/routes",
            "Did you forget to register the route?",
            "Restart the server after changes"
        ]
    });
};
