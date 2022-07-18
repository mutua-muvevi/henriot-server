const nodemailer = require("nodemailer");
const logger = require("./logger");
const handlebars = require("nodemailer-express-handlebars");

const sendEmail = (options) => {

	// the transporter that will send the mail
	const transporter = nodemailer.createTransport({
		service : process.env.EMAIL_SERVICE,
		auth: {
			user: process.env.EMAIL_USERNAME,
			pass: process.env.EMAIL_PASSWORD
		}
	})

	transporter.use("compile", handlebars({
		viewEngine: "express-handlebars",
		viewPath: "../views/"
	}))

	// mail options
	const mailOptions = {
		from: process.env.EMAIL_FROM,
		to: options.to,
		subject: options.subject,
		html: options.html,
		template: "index"
	}

	transporter.sendMail(mailOptions, (error, info) => {
		if(error){
			logger.error(`Send Mail Error : ${error}`)
		} else {
			logger.info(`Email sent successfully`)
		}
	})
}

module.exports = sendEmail