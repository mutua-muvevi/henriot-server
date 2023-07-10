const mongoose = require("mongoose")

const Notification = require("../../model/notification/notification");
const ErrorResponse = require("../../utils/errorResponse");
const User = require("../../model/user/user");

exports.editNotification = async (req, res, next) => {
	const { title, description, type, createdBy, category, subCategory, isRead } = req.body
	const { id } = req.params

	const noNotificationFound = "Invalid notification!"

	const message = "Notification marked as read successfully"
	
	try {
		//check for the user ID
		if(!createdBy || !mongoose.Types.ObjectId.isValid(createdBy)){
			return next(new ErrorResponse("Invalid User", 401))
		}

		//check for the notification ID
		if(!id || !mongoose.Types.ObjectId.isValid(id)){
			return next(new ErrorResponse(noNotificationFound, 404))
		}

		//initiating perfomance check
		const start = performance.now()

		//finding the user
		const user = await User.findById(createdBy)

		if(!user){
			return next(new ErrorResponse("Invalid User", 400))
		}

		//finding the notification
		const notification = await Notification.findById(id)

		if(!notification){
			return next(new ErrorResponse(noNotificationFound, 404))
		}

		//updating notification
		if (isRead) notification.isRead = isRead

		//saving notification
		await notification.save()

		//ending perfomance check
		const end = performance.now()
		const timeTaken = end - start

		res.status(200).json({
			success: true,
			data: notification,
			message,
			timeTaken,
		})

	} catch (error) {
		logger.error(`Caught edit notification error: ${JSON.stringify(error)}`)
		next(error)
	}
}