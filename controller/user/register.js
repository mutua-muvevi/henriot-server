const mongoose = require("mongoose");

const ErrorResponse = require("../../utils/errorResponse");
const User = require("../../model/user/user");
const sendEmail = require("../../utils/sendMail");
const cloudinary = require("../../utils/cloudinary");
const logger = require("../../utils/logger");

const { generatePassword } = require("../../middleware/password");
const { issueJWT } = require("../../middleware/token");
const Notification = require("../../model/notification/notification");

//register
//register errors
const message = "User created successfully";

//register route
exports.register = async (req, res, next) => {
	const {
		investorType,
		email,
		firstname,
		lastname,
		phoneNumber,
		introducerCode,
		street,
		city,
		state,
		postcode,
		dateOfBirth,
		passportNumber,
		annualIncome,
		occupation,
		valueOfAsset,
		consent,
		issuingCountry,
		identificationType,
		phoneVerification,
		emailVerification,
		password,
	} = req.body;

	try {
		//check for unavailability
		if (!email) {
			return next(new ErrorResponse("Email is required", 400));
		}
		if (!firstname) {
			return next(new ErrorResponse("Firstname is required", 400));
		}
		if (!lastname) {
			return next(new ErrorResponse("Lastname is required", 400));
		}
		if (!phoneNumber) {
			return next(new ErrorResponse("Phone number is required", 400));
		}
		if (!introducerCode) {
			return next(new ErrorResponse("Introducer code is required", 400));
		}
		if (!password) {
			return next(new ErrorResponse("Password is required", 400));
		}
console.log(req.body)
		// user with exact email
		const emailExists = await User.findOne({ email });

		if(emailExists){
			return next(new ErrorResponse("User exists", 400))
		}

		//checking the perfomance time
		const start = performance.now();

		const id = { _id: new mongoose.Types.ObjectId() };

		//password generation
		const saltHash = generatePassword(password);

		const salt = saltHash.salt;
		const hash = saltHash.hash;

		const newUser = new User({
			id,
			investorType,
			email,
			firstname,
			lastname,
			phoneNumber,
			introducerCode,
			street,
			city,
			state,
			postcode,
			dateOfBirth,
			passportNumber,
			annualIncome,
			occupation,
			valueOfAsset,
			consent,
			issuingCountry,
			identificationType,
			phoneVerification,
			emailVerification,
			salt,
			hash
		});

		if (!newUser) {
			return next(new ErrorResponse(error500, 500));
		}

		await newUser.save();

		const token = issueJWT(newUser);

		//notification
		const notificationTitle = `New Account Created`;
		const notificationType = "create";
		const category = "user";
		const subCategory = "account";
		const isRead = false;

		const notification = await Notification.create({
			title: notificationTitle,
			type: notificationType,
			category,
			subCategory,
			isRead,
			createdBy: newUser._id
		});

		if (!notification) {
			logger.error(
				`Notification Error: Something went wrong while creating client create notification`
			);
			return next(new ErrorResponse(error500, 500));
		}

		const end = performance.now();

		const timeTaken = end - start;

		res.status(201).json({
			success: true,
			token,
			message,
			timeTaken,
		});
	} catch (error) {
		logger.error(`Caught user register error : ${JSON.stringify(error)}`);
		next(error);
	}
};
