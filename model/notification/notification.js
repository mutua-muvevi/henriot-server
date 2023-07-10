//package imports
const mongoose = require("mongoose");

//initialization
const { Schema } = mongoose

//Schema options
const SchemaOptions = {
	timestamps: true,
	autoIndex: false,
	collection: "Notification",
	optimisticConcurrency: true, //enables updating docs doesnt change in between two methods
	collation: {
		//collation is language specific
		locale: "en_US",
		strength: 1
	},
	strict: true,
}

//schema
const NotificationSchema = new Schema({
	title: {
		type: String,
		minLength: [5, "Minimum characters required for notification title is 5"],
		maxLength: [100, "Maximum characters required for notification title is 100"],
		trim: true,
		required: [true, "Title is required"]
	},
	type: {
		type: String,
		enum: {
			values: ["create", "edit", "delete"],
			message: "{VALUE} is not supported"
		},
		required: true,
		index: true
	},
	category: {
		type: String,
		enum: {
			values: [ "user", "project", "service", "client", "team", "contribution"],
			message: "{VALUE} is not supported"
		},
		required: true,
		index: true
	},
	subCategory: {
		type: String,
		enum: {
			values: ["account", "security", "general", "user", "project", "task", "expense", "member", "service", "offer", "portfolio", "faq", "client",  "job", "payment", "team", "contribution"],
			message: "{VALUE} is not supported"
		},
		index: true
	},
	description: {
		type: String,
		minLength: [10, "Minimum characters required for description is 10"],
		maxLength: [1000, "Maximum characters required for description is 1000"],
		trim: true,
		lowercase: true
	},
	image: {
		type: String,
		default: null
	},
	imageID: {
		type: String,
		default: null
	},
	isRead: {
		type: Boolean,
		default: false
	},
	createdBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
		index: true
	}
}, SchemaOptions);

const Notification = mongoose.model("Notification", NotificationSchema)

module.exports = Notification