module.exports = function (req, res, next) {
    res.format({
        json: () => {
            res.status(404).json({
                message: "404, la pagina che cerchi non esiste!",
            });
        },
        default: () => {
            res.status(404).send("<h1>404, la pagina che cerchi non esiste!</h1>");
        },
    });
};