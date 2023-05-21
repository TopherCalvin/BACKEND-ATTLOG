const express = require("express");
const router = express.Router();
const userController = require("../controllers").userController;

router.post("/", userController.insertUser); //register
router.get("/v1", userController.getUser); // login by bcrypt and set local store
router.get("/v2", userController.getUser2); // login by nanoid and set local store
router.get("/token", userController.getByToken); // get bcrypt-ed id from local storage
router.get("/token2", userController.getByToken2); // get nanoid-ed id from local storage

module.exports = router;
