const SparkPost = require("sparkpost");
const client = new SparkPost(process.env.SENDMAILAPIKEY, {origin: 'https://api.sparkpost.com'});

const SendEmail = async ({ to, from, subject, html }) => {
	const response = await client.transmissions.send({
		content: {
			from,
			subject,
			html,
		},
		recipients: [{ address: to }],
	});

	return response;
};

module.exports = SendEmail ;

