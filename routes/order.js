const express = require("express");
const router = express.Router();

const { newOrder } = require("../controller/order/new");
const { editOrder } = require("../controller/order/edit");
const { authMiddleware } = require("../middleware/auth");

router.route("/new").post(authMiddleware, newOrder)
router.route("/edit/:orderID").post(authMiddleware, editOrder)

module.exports = router