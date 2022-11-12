const socket = io('ws://localhost:8000', {
  auth: {
    token: '123'
  }

})

const url = window.location.href
const urlObj = new URL(url)
const user_name = urlObj.searchParams.get('user_name')
const user_id = urlObj.searchParams.get('user_id')

socket.on('message', text => {
  const el = document.createElement('li')
  el.innerHTML = text
  document.querySelector('ul').appendChild(el)
})

socket.on('messages', messages => {
  let listElems = ''
  messages = messages.map(msg => `${msg.user_name} said ${msg.message} at ${msg.timestamp}`) // client side

  messages.forEach(msg => {
    listElems += '<li>' + msg + '</li>'
  })
  const list = document.querySelector('ul')
  list.innerHTML = listElems
})
function sendMsg (event) {
  if (event.key !== 'Enter') return
  const timeStamp = new Date()
  const parsedTime = timeStamp.toLocaleTimeString().split(' ')[0]
  const messageObj = {
    message: event.target.value,
    timeStamp: parsedTime,
    user_name
  }
  socket.emit('message', messageObj)
  event.target.value = ''
}

async function handleLogout () {
  const response = await fetch('http://localhost:8000/api/logout')
  window.location.href = 'http://localhost:8000/static/login_page'
}
