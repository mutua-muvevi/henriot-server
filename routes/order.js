const express = require("express");
const router = express.Router();

const { newOrder } = require("../controller/order/new");
const { editOrder } = require("../controller/order/edit");
const { authMiddleware } = require("../middleware/auth");
const { deleteAllOrders, deleteSingleOrder } = require("../controller/order/delete");
const { fetchAllOrders, fetchAllIndividualOrders } = require("../controller/order/fetch");

router.route("/new").post(authMiddleware, newOrder);
router.route("/edit/:orderID").put(authMiddleware, editOrder);

router.route("/fetch/all/:userID").get(authMiddleware, fetchAllOrders);
router.route("/fetch/all/:userID/:accountID").get(authMiddleware, fetchAllIndividualOrders);

router.route("/delete/all").delete(authMiddleware, deleteAllOrders);
router.route("/delete/single/:orderID").delete(authMiddleware, deleteSingleOrder);

module.exports = router