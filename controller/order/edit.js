const logger = require("../../utils/logger");
const mongoose = require("mongoose");
const ErrorResponse = require("../../utils/errorResponse");
const User = require("../../model/user/user");
const axios = require("axios");
const Order = require("../../model/order/order");

//check for required fields
//check for accoutn and user ID
//check the user
//check for the orderID
//send the update to alpaca
//edit the order on our database after successfull alpaca edit order
//send the results to the client

exports.editOrder = async (req, res, next) => {
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

	const { orderID } = req.params

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

		//account and user ID
		if (!userID || !mongoose.Types.ObjectId.isValid(userID)) {
			return next(new ErrorResponse("Invalid user"));
		}
		
		if (!accountID) {
			return next(new ErrorResponse("Invalid account"));
		}

		if (!orderID || !mongoose.Types.ObjectId.isValid(orderID)) {
			return next(new ErrorResponse("Invalid order"));
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

		
		//checking for the orderID
		const order = await Order.findById(orderID)
		
		if(!orderID){
			return next(new ErrorResponse("That order does not exist", 404))
		}

		const orderData = { symbol, qty, side, type, time_in_force };

		//sending the order to alpaka
		let alpacaOrder = null;

		try {
			alpacaOrder = await axios({
				method: "patch",
				url: `${process.env.ALPAKA_API}/v1/trading/accounts/${accountID}/orders/${orderID}`,
				data: orderData,
				auth: {
					username: process.env.ALPAKA_KEY,
					password: process.env.ALPAKA_SECRET,
				},
			});
		} catch (error) {
			console.log("Alpaca Axios Error Here", `${error.response}`);
			logger.error(`Alpaca edit order error, ${error.response}`);
			return next(
				new ErrorResponse(
					`Alpaka edit Order Error : ${JSON.stringify(
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

		//updating the order to our database
		if(symbol) order.symbol = symbol
		if(qty) order.qty = qty
		if(side) order.side = side
		if(time_in_force) order.time_in_force = time_in_force
		if(type) order.type = type

		//saving the order
		await order.save()

		//sending the result
		res.status(200).json({
			success: true,
			data: order,
			message: "Order updated successfully"
		})

	} catch (error) {
		logger.error(`Caught edit order error : ${JSON.stringify(error)}`);
		next(error);
	}
};
