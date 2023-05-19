const express = require("express");
const router = express.Router();
const attlogController = require("../controllers").attlogController;

router.get("/", attlogController.getToday);
router.get("/", attlogController.getAll);

router.post("/", attlogController.insertAttlog);

router.patch("/", attlogController.editAttlog);

router.delete("/", attlogController.deleteAttlog);

module.exports = router;
