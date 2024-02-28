const express = require("express");
const validateUser = require("../middlewares/validateUser");
const { updateSingleUser, DeleteSingleUser, updateFollower, deleteFollower, getCurrentUser } = require("../controllers/UserControllers");
const router = express.Router();
const multer = require("multer");
const upload = multer({
  storage: multer.memoryStorage(),
});

router.use(validateUser);
router.use(upload.single("profile_pic"));
router.route("/").put(updateSingleUser).delete(DeleteSingleUser);
router.route("/follow/:id").put(updateFollower).delete(deleteFollower);
router.route("/current").get(getCurrentUser);

module.exports = router;