const logger = require("../../utils/logger");
const mongoose = require("mongoose");
const ErrorResponse = require("../../utils/errorResponse");
const User = require("../../model/user/user");
const axios = require("axios");
const Order = require("../../model/order/order");

//check for required fields
//check for accountID and userID
//send the order to alpaka
//create the order to our database after successful post to alpaka
//send results to the client

exports.newOrder = async (req, res, next) => {
	const {
		symbol,
		qty,
		side,
		type,
		time_in_force,
		limit_price,
		stop_price,
		trail,
		userID,
		accountID,
	} = req.body;

	try {
		//check for required fields
		if (!symbol) {
			return next(new ErrorResponse("Symbol is required"));
		}
		if (!qty) {
			return next(new ErrorResponse("Quantity is required"));
		}
		if (!side) {
			return next(
				new ErrorResponse("Order type is required, either buy or sell")
			);
		}
		if (!type) {
			return next(new ErrorResponse("Type is required"));
		}
		if (!time_in_force) {
			return next(new ErrorResponse("Time in force is required"));
		}

		if (!userID || !mongoose.Types.ObjectId.isValid(userID)) {
			return next(new ErrorResponse("Invalid user"));
		}
		if (!accountID) {
			return next(new ErrorResponse("Invalid account"));
		}

		//check for the user
		const user = await User.findById(userID);

		if (!user) {
			return next(new ErrorResponse("User not found", 404));
		}

		//check if the above user has the account id that matches with the one fron req.body
		if (user.account_id !== accountID) {
			return next(new ErrorResponse("Invalid user account", 400));
		}

		const orderData = { symbol, qty, side, type, time_in_force };

		//sending the order to alpaka
		let alpacaOrder = null;

		try {
			alpacaOrder = await axios({
				method: "post",
				url: `${process.env.ALPAKA_API}/v1/trading/accounts/${accountID}/orders`,
				data: orderData,
				auth: {
					username: process.env.ALPAKA_KEY,
					password: process.env.ALPAKA_SECRET,
				},
			});
		} catch (error) {
			console.log("Alpaca Axios Error Here", `${error.response}`);
			logger.error(`Alpaca post order error, ${error.response}`);
			return next(
				new ErrorResponse(
					`Alpaka Post Order Error : ${JSON.stringify(
						error.response
					)}`,
					500
				)
			);
		}

		if (!alpacaOrder || alpacaOrder === null) {
			return next(
				new ErrorResponse("Alpaka post order cannot be null", 400)
			);
		}

		//creating the order to our database
		const order = new Order(orderData);

		if (!order) {
			return next(
				new ErrorResponse(
					"Something went wrong while creating the order",
					500
				)
			);
		}

		await order.save();

		//push the order to user


		// sending the result to client
		res.status(201).json({
			success: true,
			data: order,
			message: "Your order was posted successfully",
		});
	} catch (error) {
		logger.error(`Caught new order error : ${JSON.stringify(error)}`);
		next(error);
	}
};
