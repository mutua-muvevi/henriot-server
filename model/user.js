const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

// the user schema
const UserSchema = new mongoose.Schema({
	email: {
		type: String,
		minlength: [5, "The minimum length required for email is 5"],
		maxlength: [50, "The maximum length required for email is 50"],
		required: [true, "Please provide your email"],
		match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Please provide a valid email"],
		unique: true,
		trim: true,
		lowercase: true,
		immutable: true
	},
	username: {
		type: String,
		minlength: [2, "The minimum character allowed for username is 2"],
		maxlength: [80, "The maximum character allowed for username is 80"],
		required: [true, "Please provide your username"],
		unique: true,
		trim: true,
		lowercase: true
	},
	country: {
		type: String,
		minlength: [4, "The minimum length required for country is 4"],
		maxlength: [56, "The maximum length required for country is 56"],
		required: [true, "Please provide your country name"],
		trim: true,
		lowercase: true
	},
	password: {
		type: String,
		minlength: [3, "The minimum length required for password is 3"],
		maxlength: [2500, "The maximum length required for password is 2500"],
		required: [true, "Password is a required field"]
	},
	authorization: {
		type: String,
		enum: ["henriot super admin", "admin", "user"],
		trim: true,
		lowercase: true
	}
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


// hashing the passowrds
UserSchema.pre("save", async function(next){
	if(!this.isModified("password")){
		next()
	}

	const salt = await bcrypt.genSalt(10)
	this.password = await bcrypt.hash(this.password, salt)
	next()
})

// comparing passwords
UserSchema.methods.comparePasswords = async function(password){
	return await bcrypt.compare(password, this.password)
}

// generating json tokens
UserSchema.methods.genToken = function(){
	return jwt.sign(
		{ id: this._id, email: this.email },
		process.env.JWT_SECRET,
		{ expiresIn: process.env.JWT_EXPIRY }
	)
}

// generating reset token
UserSchema.methods.genResetToken = function(){
	const resetToken = crypto.randomBytes(10).toString("hex")

	this.resetPasswordToken = crypto
		.createHash("sha256")
		.update(resetToken)
		.digest("hex")
	
	this.resetPasswordExpiry = Date.now() + 240 * (60 * 1000)
	return resetToken
}

// the model
const User = mongoose.model("User", UserSchema)
module.exports = User