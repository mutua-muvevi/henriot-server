//package imports
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

//initialization
const { Schema } = mongoose;

//Schema options
const MainSchemaOptions = {
	timestamps: true,
	autoIndex: false,
	collection: "User",
	optimisticConcurrency: true, //enables updating docs doesnt change in between two methods
	collation: {
		//collation is language specific
		locale: "en_US",
		strength: 1
	},
	timeseries: {
		timeField: 'timestamp',
		metaField: 'metadata',
		granularity: 'hours'
	},
}

//WILL CONVERT THIS TO SUBDOCUMENT TYPE
//main schema
const UserSchema = new Schema({
	email: {
		type: String,
		match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Your email format should be __@_.__, instead got {VALUE}"],
		trim: true,
		immutable: true,
		required: [true, "Your email is required"],
		unique: true,
		lowercase: true,
		index: true
	},
	phone_number: {
		type: String,
		trim: true,
	},
	street_address: {
		type: String,
		trim: true,
	},
	city: {
		type: String,
		trim: true,
	},
	state: {
		type: String,
		trim: true,
	},
	postal_code: {
		type: String,
		trim: true,
	},
	country: {
		type: String,
		trim: true,
	},
	identity: {
		given_name : String,
		middle_name : String,
		family_name : String,
		date_of_birth : Date,
		tax_id : String,
		tax_id_type : String,
		country_of_citizenship : String,
		country_of_birth : String,
		country_of_tax_residence : String,
		funding_source : Array,
	},
	trusted_contact: {
		given_name: String,
		family_name: String,
		email_address: String,
	},

	phoneVerification: {
		type: String,
		trim: true,
	},
	
	emailVerification: {
		type: String,
		trim: true,
	},
	notification: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Notification'
		}
	],
	language:{
		type: String,
		enum: {
			values: ["english", "french", "spanish", "russian", "chinese"],
			message: "{VALUE} is not supported"
		},
		default:"english"
	},


	hash: String,
	salt: String,

	loginAttempts: {
		type: Number,
		required: true,
		default: 0
	},
	lockUntil: { type: Date },

	resetPasswordToken:String,
	resetPasswordExpiry:Date,

}, MainSchemaOptions)
	
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


const User = mongoose.model("User", UserSchema);

module.exports = User;