const express = require("express");
const multer = require("multer");
const moviesService = require("../services/moviesService");

const router = express.Router();
const upload = multer();


router.get("/", async (req, res) => {
res.send("tes")
});

module.exports = router;