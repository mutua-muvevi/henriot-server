// node modules import
require("dotenv").config({path: "./config.env"});
const express = require("express");
const cors = require("cors");
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const helmet = require("helmet");
const hpp = require("hpp");
const winston = require("winston")
// require('winston-mongodb');

// constom modules import
const connectDB = require("./config/database");
const errorHandler = require("./middleware/error");
const logger = require("./utils/logger");
// const handlebar = require("express-handlebars");


// express initialization
const app = express()


// initializing database
connectDB()

// initializing api limiter
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 100,
	standardHeaders: true,
	legacyHeaders: false, 
	message: 'Too many requests from this IP, please try again in 15 minutes!',
})

// app.engine("handlebars", handlebar({ defaultLayout: "main" }) )
//Sets our app to use the handlebars engine
app.set('view engine', 'handlebars');

// express middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(hpp());
app.use(limiter);
app.use(mongoSanitize());
app.use(xss());
app.use("/api/user", require("./routes/user"));


// error middle ware
app.use(errorHandler);

// port connection
const PORT = process.env.PORT || 5000
app.listen(PORT, () => logger.info(`Connected to port ${PORT}`))


// process termination after unhandles promise rejection
process.on("unhandledRejection", (error, promise) => {
	if(error){
		logger.error("Unhandled Promise Rejection Error :", error)
		process.exit(1)
	} else {
		logger.info("Unhandled Promise Rejection Promise :", promise)
	}
})