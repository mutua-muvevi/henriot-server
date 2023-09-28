//package imports
const mongoose = require("mongoose");
const crypto = require("crypto");

//initialization
const { Schema } = mongoose;


//Schema options
const SchemaOptions = {
	timestamps: true,
	autoIndex: false,
	collection: "User",
	optimisticConcurrency: true,
}