const express = require("express");
const { testGet } = require("../controllers/testControllers");
const router = express.Router();

router.route('/').get(testGet);

module.exports = router;