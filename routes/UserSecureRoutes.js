const express = require("express");
const validateUser = require("../middlewares/validateUser");
const { updateSingleUser, DeleteSingleUser, updateProfilePic, getProfilePic, updateFollower, deleteFollower } = require("../controllers/UserControllers");
const router = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: './profilePics',
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}.jpeg`);
  },
});

const upload = multer({ storage });

router.use(validateUser);
router.use(upload.single("profile_pic"));
router.route("/").put(updateSingleUser).delete(DeleteSingleUser);
router.route("/profile_pic").put(updateProfilePic).get(getProfilePic);
router.route("/follow/:id").put(updateFollower).delete(deleteFollower);

module.exports = router;