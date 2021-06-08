const mongoose = require('mongoose')
const db = require('../config/keys').mongodbURI

mongoose
	.connect(db, {
		useCreateIndex: true,
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
	})
	.then(() => console.log('Connected to mongodb atlas'))
	.catch((err) => {
		console.log(err.message)
		process.exit(1)
	})
