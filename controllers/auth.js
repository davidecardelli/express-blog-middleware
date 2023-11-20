const generateJWT = require("../utilities/generateJWT");

function login(req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
        res.status(400).send("Attenzione! Username e Password sono obbligatori");
        return;
    }

    const users = require("../db/users.json");
    const user = users.find(
        () => user.username === username && user.password === password
    );

    if (!user) {
        res.status(401).send("Username e/o password errati!");
        return;
    }

    // se trovo utente con credenziali corrette, genero token:
    const token = generateJWT(user);

    // e lo restituisco in json
    res.json({ token });
}

module.exports = { login };




