const mongoose = require("mongoose");

const ErrorResponse = require("../../utils/errorResponse");
const User = require("../../model/user/user");
const sendEmail = require("../../utils/sendMail");
const cloudinary = require("../../utils/cloudinary");
const logger = require("../../utils/logger");

const { generatePassword } = require("../../middleware/password");
const { issueJWT } = require("../../middleware/token");
const Notification = require("../../model/notification/notification");
const axios = require("axios")

//register
//register errors
const message = "User created successfully";

//register route
exports.register = async (req, res, next) => {
	const {
		email_address,
		phone_number,
		street_address,
		unit,
		city,
		state,
		postal_code,
		country,

		given_name,
		middle_name,
		family_name,
		date_of_birth,
		tax_id,
		tax_id_type,
		country_of_citizenship,
		country_of_birth,
		country_of_tax_residence,
		funding_source,

		consent,
		enabled_assets,

		is_control_person,
		is_affiliated_exchange_or_finra,
		is_politically_exposed,
		immediate_family_exposed,
		context,

		agreements,

		trusted_given_name,
		trusted_family_name,
		trusted_email_address,
		documents,

		password,
	} = req.body;

	try {
		//check for unavailability
		if (!email_address) {
			return next(new ErrorResponse("Email is required", 400));
		}
		if (!given_name) {
			return next(new ErrorResponse("Given name is required", 400));
		}
		if (!family_name) {
			return next(new ErrorResponse("Family name is required", 400));
		}

		const contactData = {
			email_address,
			phone_number,
			street_address,
			unit,
			city,
			state,
			postal_code,
			country,
		};

		const identityData = {
			given_name,
			middle_name,
			family_name,
			date_of_birth,
			tax_id,
			tax_id_type,
			country_of_citizenship,
			country_of_birth,
			country_of_tax_residence,
			funding_source,
		};

		const disclosuresData = {
			is_control_person,
			is_affiliated_exchange_or_finra,
			is_politically_exposed,
			immediate_family_exposed,
			context,
		};
		const trusted_contact = {
			given_name: trusted_given_name,
			family_name: trusted_family_name,
			email_address: trusted_email_address,
		};

		const restructuredData = {
			enabled_assets,
			contact: contactData,
			identity: identityData,
			disclosures: disclosuresData,
			agreements,
			trusted_contact,
			documents
		};

		let newAlpakaUser
		console.log("The context is ", context)
		console.log("Req body ", req.body)
		console.log("Req restructured data ", restructuredData)
		console.log("Req disclosures context ", restructuredData.disclosures.context)
		// return res.json({
		// 	data: restructuredData,
		// 	success: true
		// })

		try {
			newAlpakaUser = await axios({
				method: "post",
				url: `${process.env.ALPAKA_API}/v1/accounts`,
				data: restructuredData,
				auth: {
					username: process.env.ALPAKA_KEY,
					password: process.env.ALPAKA_SECRET,
				  },
			})
			
		} catch (error) {
			console.log("Restuctured data", restructuredData)
			next(new ErrorResponse(`Caught API Post ERROR : ${error}`))
		}
		
		res.status(201).json({
			success: true,
			data: req.body,
			restructured: restructuredData,
			user: newAlpakaUser
		});










	} catch (error) {
		logger.error(`Caught user register error : ${JSON.stringify(error)}`);
		next(error);
	}
};

		
				//check for unavailability
				// if (!email) {
				// 	return next(new ErrorResponse("Email is required", 400));
				// }
				// if (!firstname) {
				// 	return next(new ErrorResponse("Firstname is required", 400));
				// }
				// if (!lastname) {
				// 	return next(new ErrorResponse("Lastname is required", 400));
				// }
				// if (!phoneNumber) {
				// 	return next(new ErrorResponse("Phone number is required", 400));
				// }
				// if (!introducerCode) {
				// 	return next(new ErrorResponse("Introducer code is required", 400));
				// }
				// if (!password) {
				// 	return next(new ErrorResponse("Password is required", 400));
				// }
		
				// // user with exact email
				// const emailExists = await User.findOne({ email });
		
				// if (emailExists) {
				// 	return next(new ErrorResponse("User exists", 400));
				// }
		
				// return res.status(201).json({
				// 	success: true,
				// 	data: req.body,
				// });
		
				// //checking the perfomance time
				// const start = performance.now();
		
				// const id = { _id: new mongoose.Types.ObjectId() };
		
				// //password generation
				// const saltHash = generatePassword(password);
		
				// const salt = saltHash.salt;
				// const hash = saltHash.hash;
		
				// const newUser = new User({
				// 	id,
				// 	investorType,
				// 	email,
				// 	firstname,
				// 	lastname,
				// 	phoneNumber,
				// 	introducerCode,
				// 	street,
				// 	city,
				// 	state,
				// 	postcode,
				// 	dateOfBirth,
				// 	passportNumber,
				// 	annualIncome,
				// 	occupation,
				// 	valueOfAsset,
				// 	consent,
				// 	issuingCountry,
				// 	identificationType,
				// 	phoneVerification,
				// 	emailVerification,
				// 	salt,
				// 	hash,
				// });
		
				// if (!newUser) {
				// 	return next(new ErrorResponse(error500, 500));
				// }
		
				// await newUser.save();
		
				// const token = issueJWT(newUser);
		
				// //notification
				// const notificationTitle = `New Account Created`;
				// const notificationType = "create";
				// const category = "user";
				// const subCategory = "account";
				// const isRead = false;
		
				// const notification = await Notification.create({
				// 	title: notificationTitle,
				// 	type: notificationType,
				// 	category,
				// 	subCategory,
				// 	isRead,
				// 	createdBy: newUser._id,
				// });
		
				// if (!notification) {
				// 	logger.error(
				// 		`Notification Error: Something went wrong while creating client create notification`
				// 	);
				// 	return next(new ErrorResponse(error500, 500));
				// }
		
				// const end = performance.now();
		
				// const timeTaken = end - start;
		
				// res.status(201).json({
				// 	success: true,
				// 	token,
				// 	message,
				// 	timeTaken,
				// });