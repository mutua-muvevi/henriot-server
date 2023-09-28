const mongoose = require("mongoose");

const ErrorResponse = require("../../utils/errorResponse");
const User = require("../../model/user/user");
const cloudinary = require("../../utils/cloudinary");
const logger = require("../../utils/logger");

const { generatePassword } = require("../../middleware/password");
const { issueJWT } = require("../../middleware/token");
const Notification = require("../../model/notification/notification");
const axios = require("axios");
const SendEmail = require("../../utils/sendMail");

//register
//register errors
const message = "User created successfully";

//register route
exports.register = async (req, res, next) => {
	const {
		email_address,
		phone_number,
		street_address,
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

		//find if user exists
		const userExists = await User.findOne({ email: email_address });

		if (userExists) {
			return next(
				new ErrorResponse("User with this email already exists", 400)
			);
		}

		const contactData = {
			email_address,
			phone_number,
			street_address,
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
			// documents
		};

		console.log("The context is ", context);
		console.log("Req body ", req.body);
		console.log("Req restructured data ", restructuredData);

		let newAlpacaUser;

		try {
			newAlpacaUser = await axios({
				method: "post",
				url: `${process.env.ALPAKA_API}/v1/accounts`,
				data: restructuredData,
				auth: {
					username: process.env.ALPAKA_KEY,
					password: process.env.ALPAKA_SECRET,
				},
			});
		} catch (error) {
			console.log("Alpaca Axios Error Here", `${error.response}`);
			logger.error(`Alpaca register error, ${error.response}`);
			return next(
				new ErrorResponse(
					`Alpaka Registration Error : ${JSON.stringify(error.response)}`,
					500
				)
			);
		}

		//generte the salt and hash
		const saltHash = generatePassword(password);

		const salt = saltHash.salt;
		const hash = saltHash.hash;

		//get the acount ID from alpaca
		const { account_id } = newAlpacaUser;

		//saving the user
		const user = new User({
			email: email_address,
			account_id,
			phone_number,
			street_address,
			city,
			state,
			postal_code,
			country,

			identity: identityData,
			trusted_contact,

			salt,
			hash,
		});

		if (!user) {
			return next(
				new ErrorResponse(
					"Something went wrong while creating user",
					500
				)
			);
		}

		await user.save();

		//issuing the token
		const token = issueJWT(user);

		//sending email to henriot admin
		// const sendRegEmail = SendEmail({
		// 	to: "",
		// 	subject: "New user has registered"
		// })

		res.status(201).json({
			success: true,
			data: user,
			token,
		});
	} catch (error) {
		logger.error(`Caught user register error : ${JSON.stringify(error)}`);
		next(error);
	}
};
