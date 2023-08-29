const express = require("express");
const router = express.Router();

const { fetchAssets } = require("../controller/assets/fetch");

router.route("/fetch/all").get(fetchAssets)

module.exports = router