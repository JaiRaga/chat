const path = require('path')
const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const cors = require('cors')
const Filter = require('bad-words')
const app = express()

app.use(express.json())
app.use(cors())

const server = http.createServer(app)
const io = socketio(server)

const pathtoPublicDir = path.join(__dirname, 'public')
app.use(express.static(pathtoPublicDir))

// let count = 0
io.on('connection', (socket) => {
	console.log('New Socket Connection!')

	socket.emit('message', 'Welcome!')

	socket.broadcast.emit('message', 'A User has entered the chat.')

	// Sending messages
	socket.on('sendMessage', (message, callback) => {
		const filter = new Filter()
		if (filter.isProfane(message)) {
			return callback('Profanity is not allowed!')
		}

		console.log(message)

		io.emit('message', message)

		callback('Delivered!')
	})

	socket.on('disconnect', () => {
		io.emit('message', 'A User has left the chat.')
	})

	// Sending locations
	socket.on('sendLocation', (location, cb) => {
		const { latitude, longitude } = location
		socket.broadcast.emit(
			'message',
			`https://google.com/maps?q=${latitude},${longitude}`
		)
		cb('Location Shared!')
	})

	// socket.emit('message', message)

	// socket.emit('countUpdated', count)

	// socket.on('increment', () => {
	// 	++count
	// 	io.emit('countUpdated', count)
	// })
})

const PORT = process.env.PORT || 9000

server.listen(PORT, () => console.log(`Server is up on ${PORT}`))
