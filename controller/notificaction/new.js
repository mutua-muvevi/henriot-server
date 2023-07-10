const mongoose = require("mongoose");

const Notification = require("../../model/notification/notification");
const ErrorResponse = require("../../utils/errorResponse");
const logger = require("../../utils/logger");

const invalidTitle = "No title provided, please add one";
const invalidDescription = "No description provided, please add one";
const invalidType = "No type provided, please add one";
const error500 = "Something went wrong"
const invalidUser = "Invalid User"

exports.newNotification = async (req, res, next) => {
	const { title, description, type, createdBy } = req.body

	try {
		if(!createdBy || !mongoose.Types.ObjectId.isValid(createdBy)){
			return next(new ErrorResponse(invalidUser, 400))
		}

		if(!title){
			return next(new ErrorResponse(invalidTitle, 400))
		}

		if(!type){
			return next(new ErrorResponse(invalidType, 400))
		}

		const start = performance.now()

		const notification = await Notification.create({ title, description, type, createdBy })

		if(!notification){
			logger.error("Something went wrong while creating notification")
			return next(new ErrorResponse(error500, 500))
		}

		const end = performance.now()
		const timeTaken = end - start

		res.status(201).json({
			success: true,
			data: notification,
			messages: "Notification created successfully",
			timeTaken
		})
	} catch (error) {
		logger.error(`Create notification error: ${JSON.stringify(error)}`)
		next(error)
	}
}