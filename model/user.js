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
		{id: this._id, authorization: this.authorization},
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