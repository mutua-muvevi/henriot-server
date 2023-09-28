const logger = require("../../utils/logger");
const mongoose = require("mongoose");
const ErrorResponse = require("../../utils/errorResponse");
const User = require("../../model/user/user");
const axios = require("axios");
const Order = require("../../model/order/order");

//check for account and user ids
//validate user and account
//fetch all orders from alpaka
//send the orders to the client

// all individual orders
exports.fetchAllIndividualOrders = async (req, res, next) => {
	const { accountID, userID } = req.params;

	try {
		//account and user ID
		if (!userID || !mongoose.Types.ObjectId.isValid(userID)) {
			return next(new ErrorResponse("Invalid user"));
		}
		
		if (!accountID) {
			return next(new ErrorResponse("Invalid account"));
		}

		
		//check the user
		const user = await User.findById(userID);

		if (!user){
			return next(new ErrorResponse("Invalid User", 400))
		}

		//check for the account id
		if(user.account_id !== accountID) {
			return next(new ErrorResponse("Invalid user account", 400));
		}

		// get orders from user
		const orders = user.orders

		if(!orders){
			return next(new ErrorResponse("No orders found", 404))
		}

		//should attach in frontend action
		//sending the orders to client
		res.status(200).json({
			success: true,
			data: orders
		})



	} catch (error) {
		logger.error(`Caught fetch all individual orders error : ${JSON.stringify(error)}`);
		next(error);
	}
};

// all  orders
exports.fetchAllOrders = async (req, res, next) => {
	const { accountID, userID } = req.params;

	try {
		//account and user ID
		if (!userID || !mongoose.Types.ObjectId.isValid(userID)) {
			return next(new ErrorResponse("Invalid user"));
		}
		
		if (!accountID) {
			return next(new ErrorResponse("Invalid account"));
		}

		
		//check the user
		const user = await User.findById(userID);

		if (!user){
			return next(new ErrorResponse("Invalid User", 400))
		}

		//check for the account id
		if(user.account_id !== accountID) {
			return next(new ErrorResponse("Invalid user account", 400));
		}

		// get orders from user
		const orders = await Order.find({
			sort: {createdAt: -1}
		})

		if(!orders){
			return next(new ErrorResponse("No orders found", 404))
		}

		//should attach in frontend action
		//sending the orders to client
		res.status(200).json({
			success: true,
			data: orders
		})



	} catch (error) {
		logger.error(`Caught fetch all orders error : ${JSON.stringify(error)}`);
		next(error);
	}
};

//fetch single order
exports.fetchSingleOrder = async (req, res, next) => {
	const { accountID, userID, orderID } = req.params;

	try {
		//order, account and user IDs
		if (!userID || !mongoose.Types.ObjectId.isValid(userID)) {
			return next(new ErrorResponse("Invalid user"));
		}
		
		if (!accountID) {
			return next(new ErrorResponse("Invalid account"));
		}
		
		if (!orderID) {
			return next(new ErrorResponse("Invalid order item"));
		}

		
		//check the user
		const user = await User.findById(userID);

		if (!user){
			return next(new ErrorResponse("Invalid User", 400))
		}

		//check for the account id
		if(user.account_id !== accountID) {
			return next(new ErrorResponse("Invalid user account", 400));
		}

		//find the order
		const order = await Order.findById(orderID);

		if(!order){
			return next(new ErrorResponse("Order not found", 404))
		}

		res.status(200).json({
			success: true,
			data: order
		})

	} catch (error) {
		logger.error(`Caught fetch single order error : ${JSON.stringify(error)}`);
		next(error);
	}
}