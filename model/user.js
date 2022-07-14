const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

// the user schema
const UserSchema = new mongoose.Schema({
	email: {
		type: String,
		minlength: [3, "The minimum length required for email is 3"],
		maxlength: [50, "The maximum length required for email is 50"],
		required: [true, "Firstname is required for email is"],
		trim: true,
		unique: true,
		immutable: true,
		lowercase: true
	},
	username: {
		type: String,
		minlength: [3, "The minimum length required for username is 3"],
		maxlength: [50, "The maximum length required for username is 50"],
		required: [true, "Firstname is required for username is"],
		trim: true,
		unique: true
	},
	password: {
		type: String,
		minlength: [3, "The minimum length required for password is 3"],
		maxlength: [2500, "The maximum length required for password is 2500"],
		required: [true, "Password is required for password is"]
	},
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