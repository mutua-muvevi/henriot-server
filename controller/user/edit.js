//check if there is ID
//check if Id is in correct format
//check if user with that id exists
//check if user exists by fullname, username, email, telephone
//update the user
//return data to the user

const mongoose = require("mongoose");

const User = require("../../model/user/user");
const logger = require("../../utils/logger");
const sendEmail = require("../../utils/sendMail");
const cloudinary = require("../../utils/cloudinary");
const ErrorResponse = require("../../utils/errorResponse");

const invalidUserError = "Invalid user!";
const error500 = "Something went wrong";
const message = "The user was updated successfuly";

//edit route
exports.editUser = async (req, res, next) => {
	const { fullname, username, bio, profession, telephone, country, city } = req.body;
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

		// user with exact fullname
		const fullnameExists = await User.findOne({fullname})

		if(fullnameExists) {
			return next(new ErrorResponse(allErrors.userExistsError, 400))
		}

		//check if username exists
		const usernameExist = await User.findOne({username})

		if(usernameExist) {
			return next(new ErrorResponse(allErrors.usernameExistsError, 400))
		}

		const mongooseOptions = {
			runValidators: true,
			new: true
		}

		//checking the perfomance
		const start = performance.now();

		const user = await User
			.findByIdAndUpdate(
				id,
				{$set: { fullname, username, bio, profession, telephone, country, city }},
				mongooseOptions
			)
			.select("-hash -salt -resetPasswordExpiry -resetPasswordToken")

		if(!user){
			logger.error("User was not edited")
			return next(new ErrorResponse(error500, 500))
		}

		const end = performance.now();
		const timeTaken = end - start;

		// sendEmail()
		
		res.status(200).json({
			success: true,
			data: user,
			message,
			timeTaken
		})

	} catch (error) {
		logger.error(error)
		next(error)
	}
}