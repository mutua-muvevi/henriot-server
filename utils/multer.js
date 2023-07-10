const multer = require("multer");
const path = require("path");

exports.upload = multer({
	storage: multer.diskStorage({}),
	fileFilter: ( req, file, callback ) => {
		let ext = path.extname(file.originalname);

		if(ext !== ".jpg" && ext !== ".png" && ext !== ".jpeg" && ext !== ".PNG"){
			callback(new Error("This file type is not supported"), false);
			return
		}
		callback(null, true)
	}
})