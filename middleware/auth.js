const jsonwebtoken = require("jsonwebtoken");
const ErrorResponse = require("../utils/errorResponse");
const logger = require("../utils/logger");

//COMING FOR THIS
//====================================
// protected routes
module.exports.authMiddleware = (req, res, next) => {
	try {
		if(!req.headers || !req.headers.authorization){
			logger.error("Invalid headers")
			return next(new ErrorResponse("Invalid Headers", 400))
		}

		const tokenParts = req.headers.authorization.split(" ");
		
		// verifying that the token from authorization header is in correct format
		if(tokenParts[0] === "Bearer" && tokenParts[1].match(/\S+\.\S+\.\S+/) !== null){

			const verification = jsonwebtoken.verify(
				tokenParts[1],
				process.env.JWT_SECRET
			);

			req.jwt = verification
			next()

		} else {
			res.status(401).json({
				success: false,
				message: "You are not authorized",
			})
		}

		} catch (error) {
			logger.error(error)
			next(error)
		}

}
//==========================================