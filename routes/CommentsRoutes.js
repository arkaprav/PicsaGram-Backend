const express = require("express");
const { getAllPostComments, getSingleComment } = require("../controllers/CommentsControllers");
const router = express.Router();

router.route("/post/:id").get(getAllPostComments);
router.route("/:id").get(getSingleComment);
module.exports = router;