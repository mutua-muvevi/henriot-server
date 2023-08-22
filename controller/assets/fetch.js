const axios = require("axios");
const ErrorResponse = require("../../utils/errorResponse");
const logger = require("../../utils/logger");

exports.fetchAssets = async (req, res, next) => {
	try {
		const assets = await axios({
			method: "get",
			url: `${process.env.ALPAKA_API}/v1/accounts`,
			auth: {
				username: process.env.ALPAKA_KEY,
				password: process.env.ALPAKA_SECRET,
			}
		})

		if(!assets){
			return next(new ErrorResponse("Something went wrong when fetching assets"))
		}

		res.status(201).json({
			success: true,
			data: assets.data
		})


	} catch (error) {
		logger.error(`Caught fetch assets : ${JSON.stringify(error)}`);
		next(error)
	}
}