const mongoose = require("mongoose");

const User = require("../../model/user/user");
const logger = require("../../utils/logger");
const sendEmail = require("../../utils/sendMail");
const cloudinary = require("../../utils/cloudinary");
const ErrorResponse = require("../../utils/errorResponse");

const invalidUserError = "Invalid user!";
const error500 = "Something went wrong";
const message = "The user image was updated successfuly";


//editImage route
exports.editUserImage = async (req, res, next) => {
	let image;
	let imageID;
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

		const start = performance.now();

		//deleting the original image
		await cloudinary
			.uploader
			.destroy(existingUser.imageID);

		const result = await cloudinary
			.uploader
			.upload(
				req.file.path,
				{folder: "Officechest/users"}
			)
		
		image = result.secure_url
		imageID = result.public_id
		
		const mongooseOptions = {
			runValidators: true,
			new: true
		}

		const user = await User
			.findByIdAndUpdate(
				id,
				{$set:{
					image,
					imageID
				}},
				mongooseOptions
			)
			.select("-hash -salt -resetPasswordExpiry -resetPasswordToken")

		const end = performance.now();
		const timeTaken = end - start;

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