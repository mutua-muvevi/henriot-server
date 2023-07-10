const express = require("express");
const router = express.Router();

const { fetchAll, fetchOne } = require("../controller/notificaction/fetch");
const { deleteNotification } = require("../controller/notificaction/delete");
const { editNotification } = require("../controller/notificaction/edit");
const { newNotification } = require("../controller/notificaction/new");

router.route("/new").post(newNotification);
router.route("/edit/:id").put(editNotification)

router.route("/fetch/all").get(fetchAll);
router.route("/fetch/one/:id").get(fetchOne);

router.route("/delete/:id").delete(deleteNotification)

module.exports = router