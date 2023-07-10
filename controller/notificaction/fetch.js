const Notification = require("../../model/notification/notification");
const ErrorResponse = require("../../utils/errorResponse");
const logger = require("../../utils/errorResponse");

const noNotifications = "No notifications found yet"
const invalidNotification = "Invalid notification"

//get all
exports.fetchAll = async (req, res, next) => {
	try {
		const start = performance.now()

		const notification = await Notification
			.find({})
			.sort({createdAt: -1})
		
		if(!notification){
			return next(new ErrorResponse("No notification found", 404))
		}

		const end = performance.now()
		const timeTaken = end - start

		res.send(200).json({
			success: true,
			data: notification,
			result: notification.length,
			timeTaken
		})
	} catch (error) {
		logger.error(`Error while fetching notification ${JSON.stringify(error)}`)
		next(error)
	}
}

//fetchByID
exports.fetchOne = (req, res, next) => {
	try {
		Notification.findById(req.params.id, (error, notification) => {
				if(!notification){
					//return next(new ErrorResponse(`User couldn't be found`, 500))
					return next(new ErrorResponse(invalidNotification, 400))
				}

				if(error){
					return next(error)
				}

				res.status(200).json({
					success: true,
					data: notification
				})
			}
		)
	} catch (error) {
		logger.error(`Error while fetching single notification ${JSON.stringify(error)}`)
		next(error)
	}
}