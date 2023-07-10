const crypto = require("crypto");
const ErrorResponse = require("../../utils/errorResponse");
const User = require("../../model/user/user");
const sendEmail = require("../../utils/sendMail");
const logger = require("../../utils/logger");
const { generatePassword } = require("../../middleware/password");

const invalidUser = "Invalid user"

// forgot password
exports.forgotPassword = async (req, res, next) => {
	const { email } = req.body

	if(!email){
		return next(new ErrorResponse("Your email is required", 400))
	}

	try {
		const user = await User.findOne({email})

		if(!user){
			return next(new ErrorResponse("Invalid email", 400))
		}

		const resetToken = user.genResetToken()
		user.save()

		// sending email part
		const resetUrl = `http://localhost:3000/auth/resetpassword/${resetToken}`

		const message = `
			<h1>You have requested a password Reset</h1>
			<p>Please click this link to reset your password, If you have not request for password reset please ignore this message.</p>
			<a href=${resetUrl} clicktracking=off>
				${resetUrl}
			</a>
		`

		try {
			sendEmail({
				to: user.email,
				subject: "You requested a password reset",
				html: message
			})

			res.status(200).json({
				success: true,
				data: "The Email was sent successfully"
			})

		} catch (error) {
			user.resetPasswordToken = undefined
			user.resetPasswordExpiry = undefined

			await user.save()

			logger.error(error)
			return next(new ErrorResponse("Email couldn't be sent", 500))
		}

	} catch (error) {
		next(error)
	}
}

// resetpassword
exports.resetpassword = async (req, res, next) => {

	const password = req.body.password

	const resetToken = crypto
		.createHash("sha256")
		.update(req.params.resetToken)
		.digest("hex")
	
	try {
		if(!password){
			return next(new ErrorResponse("Your new password is required", 400))
		}

		const user = await User.findOne({
				resetPasswordToken: resetToken,
				resetPasswordExpiry: { $gt : Date.now() }
			})
		
		if(!user){
			return next(new ErrorResponse(invalidUser, 400))
		}
		// geneerating the password
		const saltAndHash = generatePassword(password)

		// updating hash and password with new values
		user.salt = saltAndHash.salt
		user.hash = saltAndHash.hash
		user.resetPasswordToken = null
		user.resetPasswordExpiry = null
		
		user.save()
		
		res.status(200).json({
			success: true,
			message: "Your password was updated successfuly"
		})

	} catch (error) {
		logger.error(error)
		next(error)
	}

}
