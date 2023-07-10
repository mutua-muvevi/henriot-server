const ErrorResponse = require("../../utils/errorResponse");
const User = require("../../model/user/user");

const { validatePassword } = require("../../middleware/password");
const { issueJWT } = require("../../middleware/token");

const invalidAuthMessage = "Invalid email or password, please doublecheck your credentials"

// login
exports.login = async (req, res, next) => {
	const { email, password } = req.body

	try {
		if(!email){
			return next(new ErrorResponse("Your email is required", 400))
		}
		
		if(!password){
			return next(new ErrorResponse("Your password is required", 400))
		}

		const existingUser = await User.findOne({email})

		if(!existingUser){
			return next(new ErrorResponse(invalidAuthMessage, 400))
		}

		const user = await User.findOne({email})

		const isValid = validatePassword(password, user.salt, user.hash)

		if(!isValid){
			return next(new ErrorResponse(invalidAuthMessage, 400))
		}

		const tokenObject = issueJWT(user)

		res.status(200).json({
			success: true,
			token: tokenObject.token,
			expires: tokenObject.expires
		})

	} catch (error) {
		next(error)
	}
}