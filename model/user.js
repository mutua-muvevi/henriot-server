const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

// the user schema
const UserSchema = new mongoose.Schema({

}, {
	timestamps: true,
	collection: "Users",
	autoIndex: false,
	autoCreate: false,
	timeseries: {
		timeField: 'timestamp',
		metaField: 'metadata',
		granularity: 'hours'
	},
	expireAfterSeconds: 86400
});

const User = mongoose.model("User", UserSchema);
module.exports = User