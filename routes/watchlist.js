const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middleware/auth");
const { newWatchlistItem } = require("../controller/watchlist/new");
const { deleteWatchList, deleteSymbolFromWatchList } = require("../controller/watchlist/delete");
const { fetchAllWatchList, fetchAllIndividualWistList } = require("../controller/watchlist/fetch");
const { editWatchListItem } = require("../controller/watchlist/edit");
const { addAssetsToWatchList } = require("../controller/watchlist/addassets");

router.route("/new").post(authMiddleware, newWatchlistItem);
router.route("/add/assets").put(authMiddleware, addAssetsToWatchList)
router.route("/edit/:watchlistItemID").put(authMiddleware, editWatchListItem);

router.route("/fetch/all/:userID").get(authMiddleware, fetchAllWatchList);
router.route("/fetch/all/:userID/:accountID").get(authMiddleware, fetchAllIndividualWistList);

router.route("/delete/all/:accountID/:userID/:watchlistID").delete(authMiddleware, deleteWatchList);
router.route("/delete/single/:accountID/:userID/:watchlistID/:symbol").delete(authMiddleware, deleteSymbolFromWatchList);

module.exports = router