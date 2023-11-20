const express = require("express");
const dotenv = require("dotenv");
const app = express()

// ! importo i router
const postsRouter = require("./routers/posts.js");
const adminRouter = require("./routers/admin.js");
const authRouter = require("./routers/auth.js");

// Importo i middleware
const routesLoggerMiddleware = require("./middlewares/routesLogger.js");
const notFound = require("./middlewares/notFound.js");
const errorsFormatterMiddleware = require("./middlewares/errorsFormatter");

dotenv.config();

// ! uso public per i miei file statici
app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routesLoggerMiddleware);


// ! definisco le rotte e aggancio i controller per la gestione dei vari metodi
app.get('/', (req, res) => {
    res.send('<h1>Benvenuto nel mio blog!</h1> <br> <a href="/posts">I post del blog</a> <br> <a href="/posts/create">Crea nuovo post</a> ');
});
app.use("/posts", postsRouter)
app.use("/admin", adminRouter);
app.use("/", authRouter);

// ! MID
app.use(errorsFormatterMiddleware);
app.use(notFound);

// ! metto in ascolto
app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on http://localhost:${process.env.PORT}`)
})
