const path = require('path')
const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const cors = require('cors')
const Filter = require('bad-words')
const { getMessage } = require('./utils/messages')
require('./db/mongoose')
const Chat = require('./models/Chat')

const app = express()

app.use(express.json())
app.use(cors())

const server = http.createServer(app)
const io = socketio(server)

const pathtoPublicDir = path.join(__dirname, 'public')
app.use(express.static(pathtoPublicDir))

io.on('connection', (socket) => {
	console.log('New Socket Connection!')

	// Joining rooms
	socket.on('join', async ({ username, room }, callback) => {
		try {
			// add user
			const user = new Chat({ socketId: socket.id, username, room })
			await user.save()

			// Get users in a room
			const users = await Chat.find({ room: user.room })
			// console.log(users)
			socket.join(user.room)
			socket.emit(
				'message',
				getMessage(
					'Admin',
					'Welcome!, This is a demo app intended for me to get hired. Cheers!'
				)
			)

			socket.broadcast
				.to(user.room)
				.emit(
					'message',
					getMessage('Admin', `${username} has entered the chat`)
				)

			io.to(user.room).emit('roomData', {
				room: user.room,
				users,
			})
		} catch (err) {
			console.log('error from adding users', err)
			callback(err)
		}
	})

	// Sending messages
	socket.on('sendMessage', async (message, callback) => {
		try {
			// get user by socket id
			const user = await Chat.findOne({ socketId: socket.id })
			console.log(user)
			const filter = new Filter()
			if (filter.isProfane(message)) {
				return callback('Profanity is not allowed!')
			}
			console.log(message)
			io.to(user.room).emit('message', getMessage(user.username, message))
			callback('Delivered!')
		} catch (err) {
			console.log(err)
		}
	})

	// Sending locations
	socket.on('sendLocation', async (location, cb) => {
		try {
			// get user by socket id
			const user = await Chat.findOne({ socketId: socket.id })
			console.log(user)
			const { latitude, longitude } = location
			socket.broadcast
				.to(user.room)
				.emit(
					'locationMessage',
					getMessage(
						user.username,
						`https://google.com/maps?q=${latitude},${longitude}`
					)
				)
			cb('Location Shared!')
		} catch (err) {
			console.log(err)
		}
	})

	socket.on('disconnect', async () => {
		try {
			console.log('Disconnect')
			// remove user
			const user = await Chat.findOne({ socketId: socket.id })
			console.log('disconnecting', user)
			// Get users in a room
			const users = await Chat.find({ room: { $eq: user.room } })
			console.log('users on disconnect', users)
			if (user) {
				io.to(user.room).emit(
					'message',
					getMessage(user.username, `${user.username} has left the chat`)
				)
				io.to(user.room).emit('roomData', {
					room: user.room,
					users,
				})
			}
		} catch (err) {
			console.log(err)
		}
	})
})

const PORT = process.env.PORT || 9000

server.listen(PORT, () => console.log(`Server is up on ${PORT}`))
