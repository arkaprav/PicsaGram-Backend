const express = require("express");
const { getAllPostComments, getSingleComment, updateCommentLikes } = require("../controllers/CommentsControllers");
const router = express.Router();

router.route("/post/:id").get(getAllPostComments);
router.route("/:id").get(getSingleComment);
router.route("/likes/:id").put(updateCommentLikes);
module.exports = router;