const getMessage = (text) => {
	return {
		text: text,
		createdAt: new Date(),
	}
}

module.exports = {
	getMessage,
}
