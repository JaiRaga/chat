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
const $sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

// Query String
const { username, room } = Qs.parse(location.search, {
	ignoreQueryPrefix: true,
})

const autoScroll = () => {
	// new message element
	const $newMessage = $messages.lastElementChild

	// height of the new message
	const newMessageStyles = getComputedStyle($newMessage)
	const newMessageMargin = parseInt(newMessageStyles.marginBottom)
	const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

	// visible height
	const visibleHeight = $messages.offsetHeight

	// height of the container
	const containerHeight = $messages.scrollHeight

	// scroll bar position
	const scrolloffset = $messages.scrollTop + visibleHeight

	if (containerHeight - newMessageHeight <= scrolloffset) {
		$messages.scrollTop = $messages.scrollHeight
	}
}

socket.emit('join', { username, room }, (error) => {
	if (error) {
		alert(error)
		location.href = '/'
	}
})

socket.on('roomData', ({ room, users }) => {
	const html = Mustache.render($sidebarTemplate, {
		room,
		users,
	})
	document.querySelector('#sidebar').innerHTML = html
})

socket.on('message', (message) => {
	console.log(message)

	const html = Mustache.render($messageTemplate, {
		username: message.username,
		message: message.text,
		createdAt: moment(message.createdAt).format('h:mm a'),
	})

	$messages.insertAdjacentHTML('beforeend', html)

	autoScroll()
})

socket.on('locationMessage', (message) => {
	console.log('locationMessage', message)

	const html = Mustache.render($locationTemplate, {
		username: message.username,
		location: message.text,
		createdAt: moment(message.createdAt).format('h:mm a'),
	})

	$messages.insertAdjacentHTML('beforeend', html)

	autoScroll()
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
