const express = require("express");
const { getAllUsers, getSingleUser } = require("../controllers/UserControllers");
const router = express.Router();

router.route("/all").get(getAllUsers);
router.route("/:id").get(getSingleUser);

module.exports = router;