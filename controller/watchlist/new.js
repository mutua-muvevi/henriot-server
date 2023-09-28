const logger = require("../../utils/logger");
const mongoose = require("mongoose");
const ErrorResponse = require("../../utils/errorResponse");
const User = require("../../model/user/user");
const axios = require("axios");
const WatchList = require("../../model/watchlist/watchlist");

//check for required fields
//check for accountID and userID
//post watchlist to alpaka
//save the watchlist to our database
// send result to client
exports.newWatchlistItem = async (req, res, next) => {
	const { name, symbols, userID, accountID } = req.body;

	try {
		//check for required fields
		if (!symbols || symbols.length < 1 ) {
			return next(new ErrorResponse("Symbols is required"));
		}

		if (!name) {
			return next(new ErrorResponse("Watchlist name is required"));
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


		const watchlistItem = { name, symbols };

		//sending the watchlist item to alpaka
		let alpacaWatchlist = null;

		try {
			alpacaWatchlist = await axios({
				method: "post",
				url: `${process.env.ALPAKA_API}/v1/trading/accounts/${accountID}/watchlists`,
				data: watchlistItem,
				auth: {
					username: process.env.ALPAKA_KEY,
					password: process.env.ALPAKA_SECRET,
				},
			});
		} catch (error) {
			console.log("Alpaca Axios Error Here", `${error.response}`);
			logger.error(`Alpaca post watchlist item error, ${error.response}`);
			return next(
				new ErrorResponse(
					`Alpaka Post watchlist item Error : ${JSON.stringify(
						error.response
					)}`,
					500
				)
			);
		}

		if (!alpacaWatchlist || alpacaWatchlist === null) {
			return next(
				new ErrorResponse("Alpaka post watchlist item cannot be null", 400)
			);
		}

		// creating the watchlist item in our database
		const watchlist = new WatchList(watchlistItem)

		if(!watchlist){
			return next(new ErrorResponse("Something went wrong while creating watchlist item", 500))
		}

		await watchlist.save();

		//saving the watchlist to the user
		user.watchlist.push(watchlist)
		await user.save()

		
	} catch (error) {
		logger.error(`Caught new watclist item error : ${JSON.stringify(error)}`);
		next(error);	
	}
}