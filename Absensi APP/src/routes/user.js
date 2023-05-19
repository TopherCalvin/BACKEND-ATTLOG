const express = require("express");
const router = express.Router();
const userController = require("../controllers").userController;

router.post("/", userController.insertUser);
router.get("/", userController.getUser);

module.exports = router;
