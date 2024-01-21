const express = require("express");
const { getAllPosts, getSinglePost, updatePostLikes, getUserPosts } = require("../controllers/PostsController");
const router = express.Router();

router.route("/all").get(getAllPosts);
router.route("/:id").get(getSinglePost);
router.route("/user/:id").get(getUserPosts);
router.route("/likes/:id").put(updatePostLikes);

module.exports = router;