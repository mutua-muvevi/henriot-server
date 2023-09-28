const logger = require("../../utils/logger");
const mongoose = require("mongoose");
const ErrorResponse = require("../../utils/errorResponse");
const User = require("../../model/user/user");
const WatchList = require("../../model/watchlist/watchlist");

//check for account and user ID
//validate user and account id
// fetch all
//send data to client

//fetch all individual watchlist
exports.fetchAllIndividualWistList = async (req, res, next) => {
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

		//get watchlist from indivudual
		const watchlist = user.watchlist;

		if (!watchlist) {
			return next(new ErrorResponse("Watchlist not found", 400));
		}

		//will attach to frontend action
		//send
		res.status(200).json({
			success: true,
			data: watchlist,
		});
	} catch (error) {
		logger.error(
			`Caught fetch all watchlist error : ${JSON.stringify(error)}`
		);
		next(error);
	}
};

//fetch all watchlists
exports.fetchAllWatchList = async (req, res, next) => {
	const { userID } = req.params;

	try {
		//account and user ID
		if (!userID || !mongoose.Types.ObjectId.isValid(userID)) {
			return next(new ErrorResponse("Invalid user"));
		}

		//check the user
		const user = await User.findById(userID);

		if (!user) {
			return next(new ErrorResponse("Invalid User", 400));
		}

		// get watchlist from user
		const watchlist = await WatchList.find({
			sort: { createdAt: -1 },
		});

		if (!watchlist) {
			return next(new ErrorResponse("No watchlist found", 404));
		}

		//should attach in frontend action
		//sending the watchlist to client
		res.status(200).json({
			success: true,
			data: watchlist,
		});
	} catch (error) {
		logger.error(`Caught fetch all watchlist error : ${JSON.stringify(error)}`);
		next(error);
	}
};

//fetch single watchlist
exports.fetchSingleWatchList = async (req, res, next) => {
	const { accountID, userID, watchlistID } = req.params;

	try {
		//watchlist, account and user IDs
		if (!userID || !mongoose.Types.ObjectId.isValid(userID)) {
			return next(new ErrorResponse("Invalid user"));
		}
		
		if (!accountID) {
			return next(new ErrorResponse("Invalid account"));
		}
		
		if (!watchlistID) {
			return next(new ErrorResponse("Invalid watchlist item"));
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

		//find the watchlist
		const watchlist = await WatchList.findById(watchlistID);

		if(!watchlist){
			return next(new ErrorResponse("WatchList not found", 404))
		}

		res.status(200).json({
			success: true,
			data: watchlist
		})

	} catch (error) {
		logger.error(`Caught fetch single watchlist error : ${JSON.stringify(error)}`);
		next(error);
	}
}
