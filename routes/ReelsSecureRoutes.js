const express = require("express");
const validateUser = require("../middlewares/validateUser");
const { createReels, deleteReel, updateReelLikes } = require("../controllers/ReelsController");
const router = express.Router();
const multer = require("multer");
const upload = multer({
  storage: multer.memoryStorage(),
});

router.use(validateUser);
router.use(upload.single("reel_video"));
router.route("/").post(createReels);
router.route("/:id").delete(deleteReel);
router.route("/likes/:id").put(updateReelLikes);

module.exports = router;