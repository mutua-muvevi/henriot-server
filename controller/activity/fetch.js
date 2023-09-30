const logger = require("../../utils/logger");
const mongoose = require("mongoose");
const ErrorResponse = require("../../utils/errorResponse");
const User = require("../../model/user/user");

//check for account and user ID
//validate user and account id
// fetch all from alpaka
//send data to client

//fetch all activities
exports.fetchAccountActivities = async (req, res, next) => {
	const { userID, accountID } = req.params;

	try {
		// user ID
		if (!userID || !mongoose.Types.ObjectId.isValid(userID)) {
			return next(new ErrorResponse("Invalid user"), 400);
		}

		//account id
		if (!accountID) {
			return next(new ErrorResponse("Invalid account"));
		}

		//check the user
		const user = await User.findById(userID);

		if (!user) {
			return next(new ErrorResponse("Invalid User", 400));
		}

		//validating the account
		if(user.account_id !== accountID) {
			return next(new ErrorResponse("Invalid account", 400));
		}
		
		//validating the account
		if(user.account_id !== accountID) {
			return next(new ErrorResponse("Invalid account", 400));
		}

		//fetching activities from alpaka
		let activities = null;

		try {
			activities = await axios({
				method: "get",
				url: `${process.env.ALPAKA_API}/v1/accounts/activities`,
				auth: {
					username: process.env.ALPAKA_KEY,
					password: process.env.ALPAKA_SECRET,
				},
			});
		} catch (error) {
			console.log("Alpaca Axios Error Here", `${error.response}`);
			logger.error(`Alpaca get activities error, ${error.response}`);
			return next(
				new ErrorResponse(
					`Alpaka Get activities Error : ${JSON.stringify(
						error.response
					)}`,
					500
				)
			);
		}

		if (!activities || activities === null) {
			return next(
				new ErrorResponse("Alpaka get activities cannot be null", 400)
			);
		}

		//send activities to client
		res.status(200).json({
			success: true,
			data: activities
		})

	} catch (error) {
		logger.error(`Caught fetch all activities from single individual error : ${JSON.stringify(error)}`);
		next(error)
	}
}

//fetch activities by type
exports.fetchActivitiesByType = async (req, res, next) => {
	const { userID, accountID, activityType } = req.params

	try {
		//user ID
		if (!userID || !mongoose.Types.ObjectId.isValid(userID)) {
			return next(new ErrorResponse("Invalid user"), 400);
		}

		if (!activityType) {
			return next(new ErrorResponse("Aactivity type is required"), 400);
		}

		//account id
		if (!accountID) {
			return next(new ErrorResponse("Invalid account"));
		}

		//check the user
		const user = await User.findById(userID);

		if (!user) {
			return next(new ErrorResponse("Invalid User", 400));
		}

		//fetching activities from alpaka
		let activities = null;

		try {
			activities = await axios({
				method: "get",
				url: `${process.env.ALPAKA_API}/v1/accounts/activities/${activityType}`,
				auth: {
					username: process.env.ALPAKA_KEY,
					password: process.env.ALPAKA_SECRET,
				},
			});
		} catch (error) {
			console.log("Alpaca Axios Error Here", `${error.response}`);
			logger.error(`Alpaca get activities error, ${error.response}`);
			return next(
				new ErrorResponse(
					`Alpaka Get activities Error : ${JSON.stringify(
						error.response
					)}`,
					500
				)
			);
		}

		if (!activities || activities === null) {
			return next(
				new ErrorResponse("Alpaka get activities cannot be null", 400)
			);
		}

		//send activities to client
		res.status(200).json({
			success: true,
			data: activities
		})

	} catch (error) {
		logger.error(`Caught fetch activities error : ${JSON.stringify(error)}`);
		next(error)
	}
}