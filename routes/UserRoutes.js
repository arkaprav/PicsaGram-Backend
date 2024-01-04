const express = require("express");
const { getAllUsers, getSingleUser, getProfilePic } = require("../controllers/UserControllers");
const router = express.Router();

router.route("/all").get(getAllUsers);
router.route("/:id").get(getSingleUser);
router.route("/profile_pic/:id").get(getProfilePic);

module.exports = router;