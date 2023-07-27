const express = require("express");
const router = express.Router()

//controllers
const { postEmail } = require("../controller/email/email")

//route
router.route("/post").post(postEmail)

//export
module.exports = router