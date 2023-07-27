const SendEmail = require("../../utils/sendMail");
const logger = require("../../utils/logger");
const ErrorResponse = require("../../utils/errorResponse");

exports.contactMessage = async (req, res, next) => {
	const { firstname, lastname, email, phone, address, description, foreign_exchange_fund, cec_fund, diverse_fund } = req.body;

	try {
		if (!firstname) {
			return next(new ErrorResponse("Firstname is required", 400));
		}

		if (!email) {
			return next(new ErrorResponse("Email is required", 400));
		}

		if (!description) {
			return next(new ErrorResponse("Description is required", 400));
		}

		const emailHTML = `
				<h1>Contact Message</h1>
				<h2>From: ${firstname} ${lastname}</h2>
				<p><strong>Email:</strong> ${email}</p>
				<p><strong>Address:</strong> ${address}</p>
				<p><strong>Description:</strong> ${description}</p>
			`;

		//sending the email
		const emailData = {
			to: "info@afrigorithm.com",
			from: process.env.SENDMAILAPIFROM,
			subject: `Contact Message from : ${firstname}`,
			html: emailHTML,
		};

		// const response = await SendEmail(emailData)

		res.status(200).json({
			success: true,
			// data: response,
			message: "Message sent successfully"
		})

	} catch (error) {
		logger.error(`Caught send contact error: ${JSON.stringify(error)}`);
		next(error);
	}
};
