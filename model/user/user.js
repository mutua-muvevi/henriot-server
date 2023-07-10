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
	investorType: {
		type: String,
		minLength: [4, "Minimum characters required for investor type is 4"],
		maxLength: [50, "Maximum characters required for investor type is 50"],
		lowercase: true,
		trim: true,
		unique: true,
		required: [true, "Your investorType is required"]
	},
	email: {
		type: String,
		minLength: [4, "Minimum characters required for email is 4"],
		maxLength: [50, "Maximum characters required for email is 50"],
		match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Your email format should be __@_.__, instead got {VALUE}"],
		lowercase: true,
		trim: true,
		immutable: true,
		required: [true, "Your email is required"],
		unique: true,
		index: true
	},
	firstname: {
		type: String,
		minLength: [4, "Minimum characters required for firstname is 4"],
		maxLength: [50, "Maximum characters required for firstname is 50"],
		lowercase: true,
		trim: true,
		unique: true,
		required: [true, "Your firstname is required"]
	},
	lastname: {
		type: String,
		minLength: [4, "Minimum characters required for lastname is 4"],
		maxLength: [50, "Maximum characters required for lastname is 50"],
		lowercase: true,
		trim: true,
		unique: true,
		required: [true, "Your lastname is required"]
	},
	phoneNumber: {
		type: String,
		minLength: [4, "Minimum characters required for phone number is 4"],
		maxLength: [50, "Maximum characters required for phone number is 50"],
		lowercase: true,
		trim: true,
		unique: true,
		required: [true, "Your phone number is required"]
	},
	introducerCode: {
		type: String,
		minLength: [4, "Minimum characters required for introducer code is 4"],
		maxLength: [50, "Maximum characters required for introducer code is 50"],
		lowercase: true,
		trim: true,
		required: [true, "Your introducerCode is required"]
	},
	street: {
		type: String,
		minLength: [4, "Minimum characters required for street is 4"],
		maxLength: [50, "Maximum characters required for street is 50"],
		lowercase: true,
		trim: true,
		required: [true, "Your street is required"]
	},
	city: {
		type: String,
		minLength: [4, "Minimum characters required for city is 4"],
		maxLength: [50, "Maximum characters required for city is 50"],
		lowercase: true,
		trim: true,
		required: [true, "Your city is required"]
	},
	state: {
		type: String,
		minLength: [4, "Minimum characters required for state is 4"],
		maxLength: [50, "Maximum characters required for state is 50"],
		lowercase: true,
		trim: true,
		required: [true, "Your state is required"]
	},
	postcode: {
		type: String,
		minLength: [4, "Minimum characters required for postcode is 4"],
		maxLength: [50, "Maximum characters required for postcode is 50"],
		lowercase: true,
		trim: true,
		required: [true, "Your postcode is required"]
	},
	dateOfBirth: {
		type: String,
		minLength: [4, "Minimum characters required for date of birth is 4"],
		maxLength: [50, "Maximum characters required for date of birth is 50"],
		lowercase: true,
		trim: true,
		required: [true, "Your date of birth is required"]
	},
	passportNumber: {
		type: String,
		minLength: [4, "Minimum characters required for passport number is 4"],
		maxLength: [50, "Maximum characters required for passport number is 50"],
		lowercase: true,
		trim: true,
	},
	annualIncome: {
		type: String,
		minLength: [4, "Minimum characters required for annual income is 4"],
		maxLength: [50, "Maximum characters required for annual income is 50"],
		lowercase: true,
		trim: true,
		required: [true, "Your annual income is required"]
	},
	occupation: {
		type: String,
		minLength: [4, "Minimum characters required for occupation is 4"],
		maxLength: [50, "Maximum characters required for occupation is 50"],
		lowercase: true,
		trim: true,
		required: [true, "Your occupation is required"]
	},
	valueOfAsset: {
		type: String,
		minLength: [4, "Minimum characters required for value of asset is 4"],
		maxLength: [50, "Maximum characters required for value of asset is 50"],
		lowercase: true,
		trim: true,
		required: [true, "Your value of asset is required"]
	},
	consent: {
		type: Boolean,
		required: [true, "We need your consent"]
	},
	issuingCountry: {
		type: String,
		minLength: [4, "Minimum characters required for issuing country is 4"],
		maxLength: [50, "Maximum characters required for issuing country is 50"],
		lowercase: true,
		trim: true,
		required: [true, "Your issuing country is required"]
	},
	identificationType: {
		type: String,
		minLength: [4, "Minimum characters required for identification type is 4"],
		maxLength: [50, "Maximum characters required for identification type is 50"],
		lowercase: true,
		trim: true,
		required: [true, "Your identification type is required"]
	},
	phoneVerification: {
		type: String,
		minLength: [4, "Minimum characters required for phone verification is 4"],
		maxLength: [50, "Maximum characters required for phone verification is 50"],
		lowercase: true,
		trim: true,
		required: [true, "Your phone verification is required"]
	},
	emailVerification: {
		type: String,
		minLength: [4, "Minimum characters required for email verification is 4"],
		maxLength: [50, "Maximum characters required for email verification is 50"],
		lowercase: true,
		trim: true,
		required: [true, "Your email verification is required"]
	},
	
	language:{
		type: String,
		enum: {
			values: ["english", "french", "spanish", "russian", "chinese"],
			message: "{VALUE} is not supported"
		},
		default:"english"
	},

	devices:[],


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