const socket = io()

document.querySelector('#message-form').addEventListener('submit', (e) => {
	e.preventDefault()

	const message = e.target.elements.message.value

	socket.emit('sendMessage', message, (error) => {
		if (error) {
			return console.log(error)
		}
		console.log('Message Delivered!')
	})
})

socket.on('message', (message) => console.log(message))

document.querySelector('#send-location').addEventListener('click', () => {
	if (!navigator.geolocation) {
		return
	}
	navigator.geolocation.getCurrentPosition((position) => {
		const { latitude, longitude } = position.coords
		const location = { latitude, longitude }

		socket.emit('sendLocation', location, (message) => {
			console.log(message)
		})
	})
})

// socket.on('countUpdated', (count) => {
// 	console.log(count)
// })

// document.querySelector('#increment').addEventListener('click', () => {
// 	console.log('Clicked!')
// 	socket.emit('increment')
// })

// socket.on('message', (message) => {
// 	console.log(message)
// })
