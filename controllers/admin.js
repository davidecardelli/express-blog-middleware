function index(req, res) {
    res.send("Benvenuto" + req.res.username);
}

module.exports = { index };