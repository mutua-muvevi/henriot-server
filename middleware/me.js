 const User = require("../model/user/user");
const ErrorResponse = require("../utils/errorResponse");
const logger = require("../utils/logger");

const invalidJWT = "Invalid User"

const userPopulation = [
	{ path: "notification", strictPopulate: false },
	{ path: "orders", strictPopulate: false },

]

exports.getMe = async ( req, res, next ) => {
	const { jwt } = req

	try {
		if(!jwt){
			return next(new ErrorResponse(invalidJWT, 401))
		}
	
		const userID = jwt.sub
		
		
		
		try {
			const start = performance.now()

			const user = await User
				.findById(userID)
				.populate(userPopulation)
				.select("-salt -hash -imageID")
				
			if(!user){
				return next(new ErrorResponse("Can't get the user", 404))
			}

			const end = performance.now()

			const timeTaken = end - start

			req.user = user
			req.user.timeTaken = timeTaken
			next()

			
			
		} catch (error) {
			logger.error(`Get User Error: ${JSON.stringify(error)}`)
			next(error)
		}
		
	} catch (error) {
		logger.error(`Get me Error: ${JSON.stringify(error)}`)
		next(error)
	}
}