const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middleware/auth");
const { fetchAllIndividualPositions, fetchAllPositions, fetchOpenPosition } = require("../controller/position/fetch");
const { closeAllPosition, closeSinglePosition } = require("../controller/position/delete");

router.route("/fetch/all/:userID").get(authMiddleware, fetchAllPositions)
router.route("/fetch/all/:userID/:accountID").get(authMiddleware, fetchAllIndividualPositions)
router.route("/fetch/all/:userID/:accountID/:symbol").get(authMiddleware, fetchOpenPosition)

router.route("/delete/all/:userID/:accountID/").delete(authMiddleware, closeAllPosition);
router.route("/delete/all/:userID/:accountID/:symbol").delete(authMiddleware, closeSinglePosition);

module.exports = router