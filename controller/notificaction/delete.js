const Notification = require("../../model/notification/notification");
const ErrorResponse = require("../../utils/errorResponse");

exports.deleteNotification = (req, res, next) => {
	const invalidNotification = "Invalid notification"
	const deleteSuccess = "Notification deleted successfully"
	
	const deleteOptions = {}

	try {
		Notification.findOneAndDelete(
			{_id: req.params.id},
			deleteOptions,
			(error, notification) => {
				if(!notification){
					return next(new ErrorResponse(invalidNotification, 400))
				}

				if(error){
					return next(error)
				}

				res.status(200).json({
					success: true,
					message: deleteSuccess
				})
			}
		)
	} catch (error) {
		next(error)
	}
}