//package imports
require("dotenv").config({ path: "./config.env" });
const express = require("express");
const cors = require("cors");

//file imports
const logger = require("./utils/logger");
const connectDB = require("./config/database");
const errorHandler = require("./middleware/error");

//initialization
connectDB();
const app = express();

//imported middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//custom middleware
app.use("/api/user", require("./routes/user"));
app.use("/api/notification", require("./routes/notification"));
app.use("/api/contact", require("./routes/contact"));
app.use("/api/contact", require("./routes/contact"));
app.use("/api/email", require("./routes/email"));

//error middleware
app.use(errorHandler);

//ports
const PORT = process.env.PORT || 4545;
app.listen(PORT, () => logger.info(`Connected to port ${PORT}`));

// process termination after unhandles promise rejection
process.on("unhandledRejection", (error, promise) => {
    if (error) {
        logger.error("Unhandled Promise Rejection Error :", error);
        process.exit(1);
    } else {
        logger.info("Unhandled Promise Rejection Promise :", promise);
    }
});
