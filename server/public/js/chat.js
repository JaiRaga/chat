const socket = io()

const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

// Template
const $messageTemplate = document.querySelector('#message-template').innerHTML
const $locationTemplate = document.querySelector(
	'#my-current-location'
).innerHTML

socket.on('message', (message) => {
	console.log(message)

	const html = Mustache.render($messageTemplate, {
		message: message.text,
		createdAt: moment(message.createdAt).format('h:mm a'),
	})

	$messages.insertAdjacentHTML('beforeend', html)
})

socket.on('locationMessage', (location) => {
	console.log('locationMessage', location)

	const html = Mustache.render($locationTemplate, { location })

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
