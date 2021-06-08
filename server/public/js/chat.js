const socket = io()

// Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

// Template
const $messageTemplate = document.querySelector('#message-template').innerHTML
const $locationTemplate = document.querySelector(
	'#location-message-template'
).innerHTML

// Query String
const { username, room } = Qs.parse(location.search, {
	ignoreQueryPrefix: true,
})

socket.emit('join', { username, room })

socket.on('message', (message) => {
	console.log(message)

	const html = Mustache.render($messageTemplate, {
		message: message.text,
		createdAt: moment(message.createdAt).format('h:mm a'),
	})

	$messages.insertAdjacentHTML('beforeend', html)
})

socket.on('locationMessage', (message) => {
	console.log('locationMessage', message)

	const html = Mustache.render($locationTemplate, {
		location: message.text,
		createdAt: moment(message.createdAt).format('h:mm a'),
	})

	$messages.insertAdjacentHTML('beforeend', html)
})

$messageForm.addEventListener('submit', (e) => {
	e.preventDefault()

	$messageFormButton.setAttribute('disabled', 'disabled')

	const message = e.target.elements.message.value

	socket.emit('sendMessage', message, (error) => {
		$messageFormButton.removeAttribute('disabled')
		$messageFormInput.value = ''
		$messageFormInput.focus()

		if (error) {
			return console.log(error, '!')
		}
		console.log('Message Delivered!')
	})
})

$sendLocationButton.addEventListener('click', () => {
	$sendLocationButton.setAttribute('disabled', 'disabled')

	if (!navigator.geolocation) {
		return
	}

	navigator.geolocation.getCurrentPosition((position) => {
		const { latitude, longitude } = position.coords
		const location = { latitude, longitude }

		socket.emit('sendLocation', location, (message) => {
			$sendLocationButton.removeAttribute('disabled')

			console.log(message)
		})
	})
})
