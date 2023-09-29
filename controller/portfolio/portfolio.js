const logger = require("../../utils/logger");
const mongoose = require("mongoose");
const ErrorResponse = require("../../utils/errorResponse");
const User = require("../../model/user/user");

//check for account and user ID
//validate user and account id
// fetch all from alpaka
//send data to client
exports.fetchPortfolio = async (req, res, next) => {
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

		//fetching portfolio from alpaka
		let portfolio = null;

		try {
			portfolio = await axios({
				method: "get",
				url: `${process.env.ALPAKA_API}/v1/trading/accounts/${accountID}/account/portfolio/history`,
				auth: {
					username: process.env.ALPAKA_KEY,
					password: process.env.ALPAKA_SECRET,
				},
			});
		} catch (error) {
			console.log("Alpaca Axios Error Here", `${error.response}`);
			logger.error(`Alpaca get portfolio error, ${error.response}`);
			return next(
				new ErrorResponse(
					`Alpaka Get portfolioError : ${JSON.stringify(
						error.response
					)}`,
					500
				)
			);
		}

		if (!portfolio || portfolio === null) {
			return next(
				new ErrorResponse("Alpaka get portfolio cannot be null", 400)
			);
		}

		//send portfolio to client
		res.status(200).json({
			success: true,
			data: portfolio
		})
	} catch (error) {
		logger.error(`Caught fetch all portfolio from single individual error : ${JSON.stringify(error)}`);
		next(error);}
};
