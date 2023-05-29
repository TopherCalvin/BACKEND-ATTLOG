const express = require("express");
const { fileUploader, upload } = require("../middlewares/multer");
const router = express.Router();
const userController = require("../controllers").userController;

router.post("/", userController.insertUser); //register
router.get("/v1", userController.getUser); // login by bcrypt and set local store
router.get("/v2", userController.getUser2); // login by nanoid and set local store
router.get("/token", userController.getByToken); // get bcrypt-ed id from local storage
// router.get("/token2", userController.getByToken2); // get nanoid-ed id from local storage
router.get("/forgetPass", userController.forgetPass); // login by email & generate nanoid
router.get(
  "/token2",
  userController.getByToken2,
  userController.getUserByToken
); // get user and req it back with req.user

router.post(
  "/image/v1/:id",
  fileUploader({
    destinationFolder: "avatar",
  }).single("avatar"),
  userController.uploadAvatar
);
router.patch(
  "/token2/changePass",
  userController.getByToken2,
  userController.changePass
);
router.post(
  "/image/v2/:id",
  upload.single("avatar"),
  userController.uploadAvatar2
);

router.get("/image/render/:id", userController.renderAvatar);

module.exports = router;
