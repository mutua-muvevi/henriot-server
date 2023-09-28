const express = require("express");
const router = express.Router();

const { newWatchlistItem } = require("../controller/watchlist/new");
// const { editOrder } = require("../controller/watchlist/edit");
// const { authMiddleware } = require("../middleware/auth");
// const { deleteAllOrders, deleteSingleOrder } = require("../controller/watchlist/delete");

router.route("/new").post(authMiddleware, newWatchlistItem);
// router.route("/edit/:orderID").post(authMiddleware, editOrder);
// router.route("/delete/all").post(authMiddleware, deleteAllOrders);
// router.route("/delete/single/:orderID").post(authMiddleware, deleteSingleOrder);

module.exports = router