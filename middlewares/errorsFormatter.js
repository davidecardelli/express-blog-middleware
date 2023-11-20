const fs = require("fs");
const path = require("path");

module.exports = function (err, req, res, next) {
    if (req.file) {
        fs.unlinkSync(req.file.path);
    }

    res.format({
        json: () => {
            res.status(500).json({
                message: "Something went wrong",
                error: err.name,
                errorInsance: err.name,
            });
        },
        default: () => {
            res.status(500).send("<h1>Something went wrong</h1>");
        },
    });
};