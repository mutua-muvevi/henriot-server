const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middleware/auth");
const { fetchAccountActivities, fetchActivitiesByType } = require("../controller/activity/fetch");

router.route("/fetch/all/:userID/:accountID").get(authMiddleware, fetchAccountActivities);
router.route("/fetch/all/:userID/:accountID/:activityType").get(authMiddleware, fetchActivitiesByType);

module.exports = router