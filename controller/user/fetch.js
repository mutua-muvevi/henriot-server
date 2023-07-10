const mongoose = require("mongoose");

const ErrorResponse = require("../../utils/errorResponse");
const User = require("../../model/user/user");
const crypto = require("crypto");
const sendEmail = require("../../utils/sendMail");
const logger = require("../../utils/logger");

const invalidUser = "Invalid user";
const error500 = "Something went wrong";

exports.fetchAll = async (req, res, next) => {
	try {
		
		const users = await User
			.find(
				//write a querry condition if _id is equal to the user ID, we select that one
			)
			.populate({ 
				path: "projects", 
				perDocumentLimit: 10,
				populate: {
					path: "task",
					perDocumentLimit: 20,
					populate: {
						path: "assignedTo",
						select: "fullname username email profession"
					}
				}
			})
			.populate({ path: "clients", perDocumentLimit: 10 })
			.populate({ path: "services", perDocumentLimit: 10 })
			.populate({ path: "teams", perDocumentLimit: 10 })
			.populate({ path: "notification", perDocumentLimit: 10 })
			// .populate({ path: "leads", perDocumentLimit: 10 })
			
			.select("-salt -hash -imageID")
			.lean()

		if(!users){
			return next(new ErrorResponse(error500, 500))
		}

		res.status(200).json({
			success: true,
			results: users.length,
			data: users
		})

	} catch (error) {
		logger.error(error)
		next(error)
	}
}

exports.fetchOne = async (req, res, next) => {
	const { id } = req.params;

	try {
		if(!id){
			return next(new ErrorResponse(invalidUser, 400))
		}
		
		if(!mongoose.Types.ObjectId.isValid(id)){
			return next(new ErrorResponse(invalidUser, 400))
		}

		const user = await User
			.findById(id)
			.populate({ path: "projects", perDocumentLimit: 10 })
			.populate({ path: "clients", perDocumentLimit: 10 })
			.populate({ path: "services", perDocumentLimit: 10 })
			.populate({ path: "teams", perDocumentLimit: 10 })
			.populate({ path: "notification", perDocumentLimit: 10 })
			// .populate({ path: "leads", perDocumentLimit: 10 })
			
			.select("-salt -hash -imageID")

		if(!user){
			return next(new ErrorResponse(error500, 500))
		}

		const objectsInUser = Object.values(user._doc).length

		return res.status(200).json({
			success: true,
			entries: objectsInUser,
			data: user
		})
	} catch (error) {
		logger.error(error)
		next(error)
	}
}

exports.fetchMe = async (req, res, next) => {
	try {
		const { user } = req;

		const objectsInUser = Object.values(user._doc).length

		res.status(200).json({
			success: true,
			entries: objectsInUser,
			data: user
		})
	} catch (error) {
		logger.error(error)
		next(error)
	}
}