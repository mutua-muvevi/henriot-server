const logger = require("../../utils/logger");
const mongoose = require("mongoose");
const ErrorResponse = require("../../utils/errorResponse");
const User = require("../../model/user/user");
const axios = require("axios");
const WatchList = require("../../model/watchlist/watchlist");

//check for required parameters
//validate user and account ID
//validate the watchlist item id
//send delete to alpaka
//delete from database
//remove from user
//return message to client

//delete watchlist controller
exports.deleteWatchList = async (req, res, next) => {
	const { userID, accountID, watchlistID } = req.params;

	try {
		// check for required parameters
		if (!userID || !mongoose.Types.ObjectId.isValid(userID)) {
			return next(new ErrorResponse("Invalid user", 400));
		}

		if (!watchlistID || !mongoose.Types.ObjectId.isValid(watchlistID)) {
			return next(new ErrorResponse("Invalid watchlist item", 400));
		}

		if (!accountID) {
			return next(new ErrorResponse("Invalid account", 400));
		}

		//validate user
		const user = await User.findById(userID)

		if(!user){
			return next(new ErrorResponse("User not found", 404))
		}

		//validate account
		if(user.account_id !== accountID){
			return next(new ErrorResponse("Account not found", 404))
		}

		//validate watchlist item
		const watchlist = await WatchList.findById(watchlistID)

		if(!watchlist){
			return next(new ErrorResponse("Watchlist item not found", 404))
		}

		// delete from alpaca
		const deleteAlpacaWatchlist = null

		try {
			deleteAlpacaWatchlist = await axios({
				method: "delete",
				url: `${process.env.ALPAKA_API}/v1/trading/accounts/${accountID}/watchlists/${watchlistID}`,
				auth: {
					username: process.env.ALPAKA_KEY,
					password: process.env.ALPAKA_SECRET,
				},
			});
		} catch (error) {
			console.log("Alpaca Axios Error Here", `${error.response}`);
			logger.error(`Alpaca delete watchlist Item error, ${error.response}`);
			return next(
				new ErrorResponse(
					`Alpaka delete watchlist Error : ${JSON.stringify(
						error.response
					)}`,
					500
				)
			);
		}

		if (!deleteAlpacaWatchlist || deleteAlpacaWatchlist === null) {
			return next(
				new ErrorResponse("Alpaka post watchlistItem cannot be null", 400)
			);
		}

		//delete from user
		user.watchlist = user.watchlist.filter(watchListItem => (
			!watchListItem._id.equals(watchlist._id)
		));
		await user.save()

		//delete from db
		await watchlist.remove();

		res.status(200).json({
			success: true,
			mesage: "Watchlist removed successfully"
		})


	} catch (error) {
		logger.error(`Caught delete watchlist item error : ${JSON.stringify(error)}`);
		next(error);
	}
};


//delete symbol from watchlist
exports.deleteSymbolFromWatchList = async (req, res, next) => {
	const { userID, accountID, watchlistID, symbol } = req.params;

	try {
		// check for required parameters
		if (!userID || !mongoose.Types.ObjectId.isValid(userID)) {
			return next(new ErrorResponse("Invalid user", 400));
		}

		if (!watchlistID || !mongoose.Types.ObjectId.isValid(watchlistID)) {
			return next(new ErrorResponse("Invalid watchlist item", 400));
		}

		if (!accountID) {
			return next(new ErrorResponse("Invalid account", 400));
		}

		if (!symbol) {
			return next(new ErrorResponse("Symbol is required", 400));
		}

		//validate user
		const user = await User.findById(userID)

		if(!user){
			return next(new ErrorResponse("User not found", 404))
		}

		//validate account
		if(user.account_id !== accountID){
			return next(new ErrorResponse("Account not found", 404))
		}

		//validate watchlist item
		const watchlist = await WatchList.findById(watchlistID)

		if(!watchlist){
			return next(new ErrorResponse("Watchlist item not found", 404))
		}

		// send to alpaka
		const deleteSymbolFromWatchlist = null;

		try {
			deleteSymbolFromWatchlist = await axios({
				method: "delete",
				url: `${process.env.ALPAKA_API}/v1/trading/accounts/${accountID}/watchlists/${watchlistID}/${symbol}`,
				auth: {
					username: process.env.ALPAKA_KEY,
					password: process.env.ALPAKA_SECRET,
				},
			});
		} catch (error) {
			console.log("Alpaca Axios Error Here", `${error.response}`);
			logger.error(`Alpaca delete symbol from watchlist watchlist Item error, ${error.response}`);
			return next(
				new ErrorResponse(
					`Alpaka delete symbol from watchlist watchlist Error : ${JSON.stringify(
						error.response
					)}`,
					500
				)
			);
		}

		if (!deleteSymbolFromWatchlist || deleteSymbolFromWatchlist === null) {
			return next(
				new ErrorResponse("Alpaka delete symbol from watchlist cannot be null", 400)
			);
		}

		res.status(200).json({
			success: true,
			message: "Symbol deleted successfully"
		})


	} catch (error) {
		logger.error(`Caught remove symbol from watchlist item error : ${JSON.stringify(error)}`);
		next(error);
	}
}