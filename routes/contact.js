const express = require("express");
const router = express.Router()

//controllers
const { contactMessage } = require("../controller/contact/contact")

//route
router.route("/send").post(contactMessage)

//export
module.exports = router