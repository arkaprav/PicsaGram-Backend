const express = require("express");
const validateUser = require("../middlewares/validateUser");
const { createComment, updateComment, deleteComment } = require("../controllers/CommentsControllers");
const router = express.Router();

router.use(validateUser);
router.route("/").post(createComment);
router.route("/:id").put(updateComment).delete(deleteComment);

module.exports = router;