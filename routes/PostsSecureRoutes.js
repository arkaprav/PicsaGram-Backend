const express = require("express");
const validateUser = require("../middlewares/validateUser");
const { createPosts, updatePost, deletePost, updatePostLikes, UpdateSavedPosts } = require("../controllers/PostsController");
const router = express.Router();
const multer = require("multer");
const upload = multer({
  storage: multer.memoryStorage(),
});

router.use(validateUser);
router.use(upload.single("post_image"));
router.route("/").post(createPosts);
router.route("/:id").put(updatePost).delete(deletePost);
router.route("/likes/:id").put(updatePostLikes);
router.route("/save/:id").put(UpdateSavedPosts);

module.exports = router;