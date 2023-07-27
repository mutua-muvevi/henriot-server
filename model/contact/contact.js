//package imports
const mongoose = require("mongoose");

//initialization
const { Schema } = mongoose;

//schema options
const SchemaOptions = {}

//schema
const ContactSchema = new Schema({
	fullname: {
		type: String,
		minLength: [5, "The minimum required length for fullname is 5 characters"],
		maxLength: [100, "The maximum required length for fullname is 100 characters"],
		required: true,
	},
	telephone: {
		type: String,
		minLength: [5, "The minimum required length for telephone is 5 characters"],
		maxLength: [50, "The maximum required length for telephone is 50 characters"],
	},
	email: {
		type: String,
		minLength: [5, "The minimum required length for email is 5 characters"],
		maxLength: [80, "The maximum required length for email is 80 characters"],
		match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Your email format should be __@_.__, instead got {VALUE}"],
		lowercase: true,
		trim: true,
		immutable: true,
		required: true,
	},
	message: {
		type: String,
		minLength: [20, "The minimum required length for message is 20 characters"],
		maxLength: [800, "The maximum required length for message is 800 characters"],
		required: true,
	},
}, SchemaOptions);

//the model
const Contact = mongoose.model("Contact", ContactSchema)

//export 
module.exports = Contact