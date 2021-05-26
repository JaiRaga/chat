const path = require('path')
const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(cors())

const server = http.createServer(app)
const io = socketio(server)

const pathtoPublicDir = path.join(__dirname, 'public')
app.use(express.static(pathtoPublicDir))

io.on('connection', () => {
	console.log('New Socket Connection!')
})

const PORT = process.env.PORT || 9000

server.listen(PORT, () => console.log(`Server is up on ${PORT}`))
