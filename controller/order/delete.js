const logger = require("../../utils/logger");
const mongoose = require("mongoose");
const ErrorResponse = require("../../utils/errorResponse");
const User = require("../../model/user/user");
const axios = require("axios");
const Order = require("../../model/order/order");

//--------------delete all
//check for required fields
//validate user and account
//send delete all to alpaka
//delete all from our database
//send result to client

//delete all
exports.deleteAllOrders = async (req, res, next) => {
	const { userID, accountID } = req.params;

	try {

		if(!accountID || !mongoose.Types.ObjectId.isValid(accountID)){
			return next(new ErrorResponse("Invalid account", 400))
		}

		if(!userID || !mongoose.Types.ObjectId.isValid(userID)){
			return next(new ErrorResponse("Invalid order", 400))
		}

		//validate user
		const user = await User.findById(userID);

		if(!user){
			return next(new ErrorResponse("User not found", 404))
		}

		//validate account
		if(user.account_id !== accountID){
			return next(new ErrorResponse("Account not found", 404))
		}

		//delete all from alpaca
		let deleteAllOrders = null;

		try {
			deleteAllOrders = await axios({
				method: "delete",
				url: `${process.env.ALPAKA_API}/v1/trading/accounts/${accountID}/orders`,
				auth: {
					username: process.env.ALPAKA_KEY,
					password: process.env.ALPAKA_SECRET,
				},
			});
		} catch (error) {
			console.log("Alpaca Axios Error Here", `${error.response}`);
			logger.error(`Alpaca delete all orders error, ${error.response}`);
			return next(
				new ErrorResponse(
					`Alpaka delete all Orders Error : ${JSON.stringify(
						error.response
					)}`,
					500
				)
			);
		}
		
		if (!deleteAllOrders || deleteAllOrders === null) {
			return next(
				new ErrorResponse("Something went wrong while deleting all orders from alpaca", 500)
			);
		}

		//delete all from database
		await Order.deleteMany()
		
		//delete all from user
		user.orders = []
		await user.save()
		
		res.status(200).json({
			success: true,
			message: "All orders deleted successfully"
		})
		
	} catch (error) {
		logger.error(`Caught delete all orders error : ${JSON.stringify(error)}`);
		next(error);
	}
};

//--------------delete single
//check for orderID
//check for the userID and accountID
//validate user and account
//send delete single order to alpaka
//remove the order from our database
//send result to client


//delete single
exports.deleteSingleOrder = async (req, res, next) => {
	const { userID, accountID, orderID } = req.params;

	try {
		//required fields/params
		if(!orderID || !mongoose.Types.ObjectId.isValid(orderID)){
			return next(new ErrorResponse("Invalid order", 400))
		}

		if(!accountID || !mongoose.Types.ObjectId.isValid(accountID)){
			return next(new ErrorResponse("Invalid account", 400))
		}

		if(!userID || !mongoose.Types.ObjectId.isValid(userID)){
			return next(new ErrorResponse("Invalid order", 400))
		}

		//validate user
		const user = await User.findById(userID);

		if(!user){
			return next(new ErrorResponse("User not found", 404))
		}
		
		//validate account
		if(user.account_id !== accountID){
			return next(new ErrorResponse("Account not found", 404))
		}

		//validate the order
		const order = await Order.findById(orderID)

		if(!order){
			return next(new ErrorResponse("Order not found", 404))
		}
		
		//delete single from alpaca
		let deleteSingleOrder = null;

		try {
			deleteSingleOrder = await axios({
				method: "delete",
				url: `${process.env.ALPAKA_API}/v1/trading/accounts/${accountID}/orders/${{orderID}}`,
				auth: {
					username: process.env.ALPAKA_KEY,
					password: process.env.ALPAKA_SECRET,
				},
			});
		} catch (error) {
			console.log("Alpaca Axios Error Here", `${error.response}`);
			logger.error(`Alpaca delete all orders error, ${error.response}`);
			return next(
				new ErrorResponse(
					`Alpaka delete all Orders Error : ${JSON.stringify(
						error.response
					)}`,
					500
				)
			);
		}

		if (!deleteSingleOrder || deleteSingleOrder === null) {
			return next(
				new ErrorResponse("Something went wrong while deleting single order from alpaca", 500)
			);
		}

		//delete from the user
		user.orders = user.orders.filter(orderItems => (
			!orderItems._id.equals(order._id)
		));

		await user.save()

		// deleting from our database
		await order.remove()

		res.status(200).json({
			success: true,
			message: "That order was deleted successfully"
		})
		
		
	} catch (error) {
		logger.error(`Caught delete single order error : ${JSON.stringify(error)}`);
		next(error);
	}
}