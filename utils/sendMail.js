const SparkPost = require("sparkpost");
const client = new SparkPost(process.env.SENDMAILAPIKEY, {origin: 'https://api.sparkpost.com'});

const SendEmail = async ({ to, subject, html }) => {
	const response = await client.transmissions.send({
		content: {
			from : process.env.SENDMAILAPIFROM,
			subject,
			html,
		},
		recipients: [{ address: to }],
	});

	return response;
};

module.exports = SendEmail ;

