const express = require("express");
const router = express.Router();
const postsController = require("../controllers/posts");
const multer = require("multer");

// !index
router.get("/", postsController.index);
// !show
router.get("/:slug", postsController.show);
// !create
router.get("/create", postsController.create);
// !store
router.post("/", multer({ dest: "public/imgs/posts" }).single("image"), postsController.store);

module.exports = router;