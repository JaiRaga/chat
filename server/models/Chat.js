const mongoose = require('mongoose')
const { Schema } = mongoose

const chatSchema = new Schema({
	socketId: {
		type: String,
		required: true,
	},
	username: {
		type: String,
		required: true,
		lowercase: true,
		trim: true,
	},
	room: {
		type: String,
		required: true,
		lowercase: true,
		trim: true,
	},
})

const Chat = mongoose.model('Chat', chatSchema)

module.exports = Chat
