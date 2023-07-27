const logger = require("../../utils/logger");
const ErrorResponse = require("../../utils/errorResponse");
const Email = require("../../model/email/email");

exports.postEmail = async (req, res, next) => {
	const { email, readTerms } = req.body;

	try {
		if (!email) {
			return next(new ErrorResponse("Email is required", 400));
		}

		// Check if the email exists
		const emailExists = await Email.findOne({ email });

		// If the email does not exist, create it.
		if (!emailExists) {
			const newEmail = await Email.create({ email, readTerms });

			if (!newEmail) {
				return next(
					new ErrorResponse(
						"Something went wrong while creating Email",
						400
					)
				);
			}

			res.status(200).json({
				success: true,
				data: email,
				message: "Email was created successfully",
			});
		} else {
			// If the email exists, send a response without creating it.
			res.status(200).json({
				success: false,
				message: "Email already exists",
			});
		}
	} catch (error) {
		logger.error(`Caught post email error: ${JSON.stringify(error)}`);
		next(error);
	}
};
