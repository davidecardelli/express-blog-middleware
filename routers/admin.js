const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin");
const authMiddleware = require("../middlewares/authMiddleware");

router.use(authMiddleware);
router.get("/", adminController.index);

module.exports = router;