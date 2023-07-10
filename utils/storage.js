const { Storage } = require("@google-cloud/storage");
const path = require("path");

// Creates a client from a Google service account key.
const storage = new Storage({
	projectId: "YOUR_PROJECT_ID",
	keyFilename: path.join(__dirname, "YOUR_SERVICE_ACCOUNT_KEY.json"),
});

const bucket = storage.bucket("YOUR_BUCKET_NAME");

const uploadToGCS = async (file) => {
	return new Promise((resolve, reject) => {
		if (!file) {
			reject("No image file");
		}
		let newFileName = `${Date.now()}-${file.originalname}`;

		let fileUpload = bucket.file(newFileName);

		const blobStream = fileUpload.createWriteStream({
			metadata: {
				contentType: file.mimetype,
			},
		});

		blobStream.on("error", (error) => {
			reject("Something is wrong! Unable to upload at the moment.");
		});

		blobStream.on("finish", () => {
			// The public URL can be used to directly access the file via HTTP.
			const url = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;
			resolve(url);
		});

		blobStream.end(file.buffer);
	});
};

module.exports = {
	uploadToGCS,
};
