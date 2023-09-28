const logger = require("../../utils/logger");
const mongoose = require("mongoose");
const ErrorResponse = require("../../utils/errorResponse");
const User = require("../../model/user/user");
const axios = require("axios");
const WatchList = require("../../model/watchlist/watchlist");

//check for required fields
//check for account and user ID
//check the user
//check for the watchlistID
//send the update to alpaca
//edit the watchlist on our database after successfull alpaca edit watchlist
//send results to client

//edit controller
exports.editWatchListItem = async (req, res, next) => {
	const { name, symbols, userID, accountID } = req.body;
	const { watchlistItemID } = req.params;

	try {
		//check for required fields
		if (!symbols || symbols.length < 1) {
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

		if (!watchlistItemID) {
			return next(new ErrorResponse("Invalid watchlist item"));
		}

		//validate user and account
		const user = await User.findById(userID)

		if(!user){
			return next(new ErrorResponse("User not found", 404))
		}

		//check if the above user has the account id that matches with the one fron req.body
		if (user.account_id !== accountID) {
			return next(new ErrorResponse("Invalid user account", 400));
		}

		// validate the watchlist item
		const watchlistItem = await WatchList.findById(watchlistItemID)

		if(!watchlistItem){
			return next(new ErrorResponse("Watchlist item not found", 404))
		}

		let alpakaWatchListItem = null

		try {
			alpakaWatchListItem = await axios({
				method: "put",
				url: `${process.env.ALPAKA_API}/v1/trading/accounts/${accountID}/watchlists/${watchlistItemID}`,
				data: {name, symbols},
				auth: {
					username: process.env.ALPAKA_KEY,
					password: process.env.ALPAKA_SECRET,
				},
			});
		} catch (error) {
			console.log("Alpaca Axios Error Here", `${error.response}`);
			logger.error(`Alpaca edit watchlistItem error, ${error.response}`);
			return next(
				new ErrorResponse(
					`Alpaka edit Order Error : ${JSON.stringify(
						error.response
					)}`,
					500
				)
			);
		}

		if (!alpakaWatchListItem || alpakaWatchListItem === null) {
			return next(
				new ErrorResponse("Alpaka post watchlistItem cannot be null", 400)
			);
		}

		//updating the watchlistItem to our database
		if(name) watchlistItem.name = name
		if(symbols) watchlistItem.symbols = symbols

		//saving the watchlistItem
		await watchlistItem.save()

		//sending the result
		res.status(200).json({
			success: true,
			data: watchlistItem,
			message: "Watchlist item updated successfully"
		})


	} catch (error) {
		logger.error(`Caught edit watclist item error : ${JSON.stringify(error)}`);
		next(error);
	}
};
