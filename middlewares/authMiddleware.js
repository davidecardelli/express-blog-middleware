const express = require("express");
const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
    const bearerToken = req.header("Authorization");

    if (!bearerToken) {
        return res.status(401).send("Missing Token");
    }

    // estraggo solo la parte del "codice" del token
    // metodo split per separarla dallo spazio
    const token = bearerToken.split(" ")[1];

    // .verify ha 3 argomenti:
    // - token da verificare
    // - chiave segreta del sign in (JWT_SECRET)
    // - eventuali opzioni (es algoritmo di cifratura)

    // Token:
    // Se valido, ritorna il payload del token stesso
    // Se non è valido, lancia errore che non verrà catturato dal middleware

    const jwtPayload = jwt.verify(token, process.env.JWT_SECRET);

    req["user"] = jwtPayload;

    // Passa al prossimo middleware o rotta
    // FONDAMENTALE nei middleware, senza, la richiesta resta pendente
    next();
};