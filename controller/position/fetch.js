const logger = require("../../utils/logger");
const mongoose = require("mongoose");
const ErrorResponse = require("../../utils/errorResponse");
const User = require("../../model/user/user");

//check for account and user ID
//validate user and account id
// fetch all from alpaka
//send data to client

//fetch all individual positions
exports.fetchAllIndividualPositions = async (req, res, next) => {
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

		if (!user) {
			return next(new ErrorResponse("Invalid User", 400));
		}

		//check for the account id
		if (user.account_id !== accountID) {
			return next(new ErrorResponse("Invalid user account", 400));
		}

		//fetching positions from alpaka
		let positions = null;

		try {
			positions = await axios({
				method: "get",
				url: `${process.env.ALPAKA_API}/v1/trading/accounts/${accountID}/positions`,
				auth: {
					username: process.env.ALPAKA_KEY,
					password: process.env.ALPAKA_SECRET,
				},
			});
		} catch (error) {
			console.log("Alpaca Axios Error Here", `${error.response}`);
			logger.error(`Alpaca get positions item error, ${error.response}`);
			return next(
				new ErrorResponse(
					`Alpaka Get positionsError : ${JSON.stringify(
						error.response
					)}`,
					500
				)
			);
		}

		if (!positions || positions === null) {
			return next(
				new ErrorResponse("Alpaka get positions item cannot be null", 400)
			);
		}

		//send positions to client
		res.status(200).json({
			success: true,
			data: positions
		})
	} catch (error) {
		logger.error(`Caught fetch all positions from single individual error : ${JSON.stringify(error)}`);
		next(error);
	}
};

//fetch all position
exports.fetchAllPositions = async (req, res, next) => {
	const { userID } = req.params;

	try {
		// user ID
		if (!userID || !mongoose.Types.ObjectId.isValid(userID)) {
			return next(new ErrorResponse("Invalid user"));
		}

		//validate the user
		const user = await User.findById(userID);

		if (!user) {
			return next(new ErrorResponse("Invalid User", 400));
		}

		//fetching positions from alpaka
		let positions = null;

		try {
			positions = await axios({
				method: "get",
				url: `${process.env.ALPAKA_API}/v1/accounts/positions`,
				auth: {
					username: process.env.ALPAKA_KEY,
					password: process.env.ALPAKA_SECRET,
				},
			});
		} catch (error) {
			console.log("Alpaca Axios Error Here", `${error.response}`);
			logger.error(`Alpaca get positions item error, ${error.response}`);
			return next(
				new ErrorResponse(
					`Alpaka Get positionsError : ${JSON.stringify(
						error.response
					)}`,
					500
				)
			);
		}

		if (!positions || positions === null) {
			return next(
				new ErrorResponse("Alpaka get positions item cannot be null", 400)
			);
		}

		//send positions to client
		res.status(200).json({
			success: true,
			data: positions
		})

	} catch (error) {
		logger.error(`Caught fetch all positions error : ${JSON.stringify(error)}`);
		next(error);		
	}
}


//fetch open position
exports.fetchOpenPosition = async (req, res, next) => {
	const { accountID, userID, symbol } = req.params;

	try {
		//account and user ID
		if (!userID || !mongoose.Types.ObjectId.isValid(userID)) {
			return next(new ErrorResponse("Invalid user"));
		}

		if (!accountID) {
			return next(new ErrorResponse("Invalid account"));
		}

		if (!symbol) {
			return next(new ErrorResponse("Symbol is required"));
		}

		//check the user
		const user = await User.findById(userID);

		if (!user) {
			return next(new ErrorResponse("Invalid User", 400));
		}

		//check for the account id
		if (user.account_id !== accountID) {
			return next(new ErrorResponse("Invalid user account", 400));
		}

		//fetching
		const position = null

		try {
			position = await axios({
				method: "get",
				url: `${process.env.ALPAKA_API}/v1/trading/accounts/${accountID}/positions/${symbol}`,
				auth: {
					username: process.env.ALPAKA_KEY,
					password: process.env.ALPAKA_SECRET,
				},
			});
		} catch (error) {
			console.log("Alpaca Axios Error Here", `${error.response}`);
			logger.error(`Alpaca get position item error, ${error.response}`);
			return next(
				new ErrorResponse(
					`Alpaka Get position Error : ${JSON.stringify(
						error.response
					)}`,
					500
				)
			);
		}

		if (!position || position === null) {
			return next(
				new ErrorResponse("Alpaka get position item cannot be null", 400)
			);
		}

		//send position to client
		res.status(200).json({
			success: true,
			data: position
		})

	} catch (error) {
		logger.error(`Caught fetch open position error : ${JSON.stringify(error)}`);
		next(error);
	}
}