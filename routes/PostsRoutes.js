const express = require("express");
const { getAllPosts, getSinglePost, getUserPosts } = require("../controllers/PostsController");
const router = express.Router();

router.route("/all").get(getAllPosts);
router.route("/:id").get(getSinglePost);
router.route("/user/:id").get(getUserPosts);

module.exports = router;