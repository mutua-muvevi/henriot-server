const crypto = require('crypto');
const jsonwebtoken = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// issuing token
module.exports.issueJWT = (user) => {
	const _id = user._id
	const expiresIn="1d" //expiration period of one day

	const payload = {
		sub: _id,
		iat: Date.now()
	}

	// signing the token
	const signedToken = jsonwebtoken.sign(
		payload,
		process.env.JWT_SECRET,
		{
			expiresIn: expiresIn,
		}
	)

	return {
		token: "Bearer " + signedToken,
		expires: expiresIn
	}

}

// const PRIVATE_KEY = fs.readFileSync("keys/id_rsa_priv.pem", "utf8")

// // generate public and private keys
// const genKeyPair = () => {
// 	const keyPair = crypto.generateKeyPairSync('rsa', {
// 		modulusLength: 4096, // bits - standard for RSA keys
// 		publicKeyEncoding: {
// 			type: 'pkcs1', // "Public Key Cryptography Standards 1" 
// 			format: 'pem' // Most common formatting choice
// 		},
// 		privateKeyEncoding: {
// 			type: 'pkcs1', // "Public Key Cryptography Standards 1"
// 			format: 'pem' // Most common formatting choice
// 		}
// 	});

// 	// Create the public key file
// 	fs.writeFileSync("keys/id_rsa_pub.pem", keyPair.publicKey); 
	
// 	// Create the private key file
// 	fs.writeFileSync("keys/id_rsa_priv.pem", keyPair.privateKey);
// }

// genKeyPair()


// // Original one >>>>>
// module.exports.issueJWT = (user) => {
// 	const _id = user._id
// 	const expiresIn="1d" //expiration period of one day

// 	const payload = {
// 		sub: _id,
// 		iat: Date.now()
// 	}

// 	// signing the token
// 	const signedToken = jsonwebtoken.sign(
// 		payload,
// 		PRIVATE_KEY,
// 		{
// 			expiresIn: expiresIn,
// 			algorithm: "RS256"
// 		}
// 	)

// 	return {
// 		token: "Bearer " + signedToken,
// 		expires: expiresIn
// 	}

// }
// >>>>>>>>>>>>>