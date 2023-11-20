// ! importo il 'db'
const posts = require("../db/posts.js");

//  ! importo path
const path = require("path");


// ! index
const index = (req, res) => {
    res.format({
        html: () => {
            const htmlPosts = [
                "<h1>I miei post</h1>",
                "<ul>",
                ...posts.map(
                    (post) => `<li>
                        <h3>${post.title}</h3>
                        <a href="/posts/${post.slug}" style="max-width: 100px">
                            <img src="/img/posts/${post.image}" alt="${post.title}" style="max-width: 100px" />
                        </a>
                        <ul>
                            <li>${post.content}</li>
                            <li>
                                <ol>${post.tags.map((tag) => `<li>${tag}</li>`).join("")}</ol>
                            </li>
                        </ul>
                    </li>`
                ),
                "</ul>",
            ];

            res.type("html").send(htmlPosts.join(""));
        },
        json: () => {
            res.type("json").send({ posts });
        },
        default: () => {
            res.status(406).send("Not Acceptable");
        },
    });
};


// ! show
const show = (req, res) => {
    const post = findOrFail(req, res);
    res.format({
        html: () => {
            const htmlPost = `<h1>${post.title}</h1>
            <img src="/img/posts/${post.image}" alt="${post.title}" style="max-width: 100%" />
            <p>${post.content}</p>
            <ul>${post.tags.map((tag) => `<li>${tag}</li>`).join("")}</ul>`;

            res.type("html").send(htmlPost);
        },
        json: () => {
            res.type("json").send({ post });
        },
        default: () => {
            res.status(406).send("Not Acceptable");
        },
    });
};

// ! create
const create = (req, res) => {
    res.format({
        html: () => {
            res.type("html").send("<h1>Creazione nuovo post</h1>");
        },
        default: () => {
            res.status(406).send("Not Acceptable");
        },
    });
};

// ! store
function store(req, res) {
    // leggo il DB
    const posts = require("../db/posts.json");

    // aggiungo il post al DB
    posts.push({
        ...req.body,
        slug: kebabCase(req.body.title),
        image: req.file,
    });

    // converto il DB in JSON
    const json = JSON.stringify(posts, null, 2);

    // scrivo il JSON su file
    fs.writeFileSync(path.resolve(__dirname, "..", "db", "posts.json"), json);

    res.json(posts[posts.length - 1]);
}

// ! destroy
const destroy = (req, res) => {
    const postSlug = req.params.slug;
    const posts = require("../db/posts.json");
    const postIndex = posts.findIndex((post) => post.slug === postSlug);

    if (postIndex === -1) {
        res.status(404).send("Post non trovato :(");
        return;
    }

    // ! Elimino il post dalla lista
    const deletedPost = posts.splice(postIndex, 1)[0];

    // ! Converto la lista aggiornata in JSON
    const json = JSON.stringify(posts, null, 2);

    // ! Scrivo il JSON su file
    fs.writeFileSync(path.resolve(__dirname, "..", "db", "posts.json"), json);

    // ! Controllo se il post aveva un'immagine
    if (deletedPost.image) {
        const imagePath = path.resolve(
            __dirname,
            "..",
            "public",
            "imgs",
            "posts",
            deletedPost.image
        );

        // ! Elimino l'immagine associata al post
        fs.unlinkSync(imagePath);
    }

    // ! Rispondo con un messaggio
    res.send("Post eliminato");
};


// ! download
const download = (req, res) => {
    const post = findOrFail(req, res);

    const filePath = path.resolve(
        __dirname,
        "..",
        "public",
        "img",
        "posts",
        post.image
    );

    const fileName = `${post.slug}.jpeg`;
    res.download(filePath, fileName);
};

// ? Utils
function findOrFail(req, res) {
    const slug = req.params.slug;
    const post = posts.find((post) => post.slug == slug);
    if (!post) {
        res.status(404).send(`Errore 404. Post con slug ${slug} non trovato`);
        return;
    }
    return post;
}

module.exports = { index, show, create, download, store, destroy };
