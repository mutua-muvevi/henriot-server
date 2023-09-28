//package imports
const mongoose = require("mongoose");

//initialization
const { Schema } = mongoose;

//Schema options
const SchemaOptions = {
	timestamps: true,
	autoIndex: false,
	collection: "Order",
	optimisticConcurrency: true,
};

//orderSchema
const OrderSchema = new Schema(
	{
		symbol: { type: String },
		qty: { type: String },
		side: { type: String },
		type: { type: String },
		time_in_force: { type: String },
	},
	SchemaOptions
);

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;