const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middleware/auth");
const { fetchAccountActivities, fetchActivitiesByType } = require("../controller/activity/fetch");

router.route("/fetch/all/:userID").get(authMiddleware, fetchAccountActivities);
router.route("/fetch/all/:userID/:activityType").get(authMiddleware, fetchActivitiesByType);

module.exports = router