const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middleware/auth");
const { newWatchlistItem } = require("../controller/watchlist/new");
const { deleteWatchList, deleteSymbolFromWatchList } = require("../controller/watchlist/delete");
// const { editOrder } = require("../controller/watchlist/edit");
// const { authMiddleware } = require("../middleware/auth");
// const { deleteAllOrders, deleteSingleOrder } = require("../controller/watchlist/delete");

router.route("/new").post(authMiddleware, newWatchlistItem);
// router.route("/edit/:orderID").post(authMiddleware, editOrder);
// router.route("/delete/all").post(authMiddleware, deleteAllOrders);
router.route("/delete/single/:accountID/:userID/:watchlistID").post(authMiddleware, deleteWatchList);
router.route("/delete/single/:accountID/:userID/:watchlistID/:symbol").post(authMiddleware, deleteSymbolFromWatchList);

module.exports = router