const express = require("express");
const router = express.Router();

const { register } = require("../controller/user/register");
const { login } = require("../controller/user/login");
const { forgotPassword, resetpassword } = require("../controller/user/password");
const { fetchAll, fetchOne, fetchMe } = require("../controller/user/fetch");

const { editUser } = require("../controller/user/edit");
const { editUserImage } = require("../controller/user/editImage");

const { authMiddleware } = require("../middleware/auth");
const { getMe } = require("../middleware/me");

const { upload } = require("../utils/multer");
const { deleteUser } = require("../controller/user/delete");

router.route("/register").post(upload.single("image"), register);
router.route("/login").post(login);
router.route("/forgotpassword").post(forgotPassword);
router.route("/resetpassword/:resetToken").put(resetpassword);

router.route("/fetch/all").get(authMiddleware, fetchAll);
router.route("/fetch/one/:id").get(authMiddleware, fetchOne);

//to be corrected
router.route("/fetch/me").get(authMiddleware, getMe, fetchMe);

router.route("/edit/:id").put(authMiddleware, editUser);
router.route("/edit/:id/image").put(authMiddleware, upload.single("image"), editUserImage);

router.route("/delete/one/:id").delete(authMiddleware, deleteUser);

module.exports = router