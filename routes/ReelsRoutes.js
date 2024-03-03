const express = require("express");
const { getAllReels, getSingleReel, getUserReels } = require("../controllers/ReelsController");
const router = express.Router();

router.route("/all").get(getAllReels);
router.route("/:id").get(getSingleReel);
router.route("/user/:id").get(getUserReels);

module.exports = router;