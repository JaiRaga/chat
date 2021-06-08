const getMessage = (username, text) => {
	return {
		username,
		text,
		createdAt: new Date(),
	}
}

// const getLocationMessage = (username, url) => {
// 	return {
// 		username,
// 		url,
// 		createdAt: new Date(),
// 	}
// }

module.exports = {
	getMessage,
	getLocationMessage,
}
