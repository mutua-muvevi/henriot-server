//package imports
const mongoose = require("mongoose");

//initialization
const { Schema } = mongoose;

//Schema options
const SchemaOptions = {
	timestamps: true,
	autoIndex: false,
	collection: "WatchList",
	optimisticConcurrency: true,
};

//orderSchema
const WatchListSchema = new Schema(
	{
		name: { type: String },
		symbols: { type: Array },
	},
	SchemaOptions
);

const WatchList = mongoose.model("WatchList", WatchListSchema);
module.exports = WatchList;