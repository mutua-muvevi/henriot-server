const express = require("express");
const router = express.Router();

const { newOrder } = require("../controller/order/new");
const { editOrder } = require("../controller/order/edit");
const { authMiddleware } = require("../middleware/auth");
const { deleteAllOrders, deleteSingleOrder } = require("../controller/order/delete");

router.route("/new").post(authMiddleware, newOrder);
router.route("/edit/:orderID").post(authMiddleware, editOrder);
router.route("/delete/all").post(authMiddleware, deleteAllOrders);
router.route("/delete/single/:orderID").post(authMiddleware, deleteSingleOrder);

module.exports = router