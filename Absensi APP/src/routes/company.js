const express = require("express");
const router = express.Router();
const compController = require("../controllers").compController;

router.post("/", compController.insertInto);
router.get("/", compController.getAll);

module.exports = router;
