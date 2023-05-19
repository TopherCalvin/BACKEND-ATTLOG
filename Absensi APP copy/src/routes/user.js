const express = require("express");
const router = express.Router();
const userController = require("../controllers").userController;

router.post("/v2", userController.insertUser);
router.get("/v1", userController.getUser);

module.exports = router;
