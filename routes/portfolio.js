const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middleware/auth");
const { fetchPortfolio } = require("../controller/portfolio/portfolio");

router.route("/fetch/all/:userID/:accountID").get(authMiddleware, fetchPortfolio)

module.exports = router