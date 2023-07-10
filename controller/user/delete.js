//check if there is Id
//check if ID is a valid ID
//check if user with Id exists in the DB
//delete the image
//send user and email back

const mongoose = require("mongoose");

const User = require("../../model/user/user");
const logger = require("../../utils/logger");
const sendEmail = require("../../utils/sendMail");
const cloudinary = require("../../utils/cloudinary");
const ErrorResponse = require("../../utils/errorResponse");

const invalidUserError = "Invalid user!";
const error500 = "Something went wrong";
const message = "The user was deleted successfuly";

exports.deleteUser = async (req, res, next) => {
	const { id } = req.params

	try {
		if(!id){
			return next(new ErrorResponse(invalidUserError, 400))
		}

		if(!mongoose.Types.ObjectId.isValid(id)){
			return next(new ErrorResponse(invalidUserError, 400))
		}
		
		//check if user with that id exists
		const existingUser = await User.findById(id)

		if(!existingUser){
			return next(new ErrorResponse(invalidUserError, 400))
		}

		const start = performance.now()

		//deleting the image from cloudinary
		await cloudinary
			.uploader
			.destroy(existingUser.imageID)
		
		const user = await User.findByIdAndDelete(id)

		if(!user){
			logger.error("Something went wrong when deleting the user")
			return next(new ErrorResponse(error500, 500))
		}

		const end = performance.now();
		const timeTaken = end - start;

		res.status(200).json({
			success: true,
			data: user,
			timeTaken,
			message
		})
	} catch (error) {
		logger.error(error)
		next(error)
	}
}