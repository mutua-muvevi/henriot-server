const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middleware/auth");
const { fetchAllIndividualPositions, fetchAllPositions, fetchOpenPosition } = require("../controller/position/fetch");

router.route("/fetch/all/:userID/:accountID").get(authMiddleware, fetchAllIndividualPositions)
router.route("/fetch/all/:userID").get(authMiddleware, fetchAllPositions)
router.route("/fetch/all/:userID/:accountID/:symbol").get(authMiddleware, fetchOpenPosition)

module.exports = router