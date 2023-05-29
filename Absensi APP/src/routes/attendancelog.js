const express = require("express");
const router = express.Router();
const attlogController = require("../controllers").attlogController;

router.get("/today", attlogController.getToday);

router.get("/all", attlogController.getAll);

router.get("/filter", attlogController.getFilter);

router.post("/", attlogController.insertAttlog);

router.patch("/", attlogController.editAttlog);

router.delete("/:id", attlogController.deleteAttlog);

module.exports = router;
