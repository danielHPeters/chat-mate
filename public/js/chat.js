'use strict'

function getUsername (callback) {
  let username = ''

  do {
    username = prompt('What\'s your username?')
  } while (username === '' || username === null || username === undefined)

  callback(username)
}

function appendToMessages (data) {
  $('#messages').append($('<li class="collection-item">').html(data))
}

function handleChat () {
  const socket = io()
  const events = ['hello message', 'user disconnect', 'user connect']
  let username = ''

  socket.on('connect', () => {
    getUsername(function (name) {
      username = name
      socket.emit('little_newbie', username)
    })
  })

  events.forEach(event => {
    socket.on(event, msg => {
      $('#messages').append($('<li class="collection-item">').html(msg.content))
    })
  })

  socket.on('chat message', msg => {
    appendToMessages('<strong>' + msg.user + '</strong>: ' + msg.content)
  })

  socket.on('disconnect', () => {
    appendToMessages('<strong>You have been disconnected. Trying to reconnect.</strong>')
  })

  socket.on('online users', users => {
    $('#userList').empty()

    users.forEach(user => {
      $('#userList').append($('<div class="chip">').text(user.name))
    })
  })

  socket.on('connect_failed', () => {
    appendToMessages('<strong>Connection Failed</strong>')
  })

  socket.on('user image',
    data => {
      if (data.img) {
        appendToMessages(
          '<strong>' + data.user + '</strong>: ' + '' +
          '<img class="responsive-img" src="' + data.img + '"/>'
        )
      }
    }
  )

  // Waiting for user to submit message
  $('.chat').submit(e => {
    let newMessage = $('#newMessage')
    socket.emit('chat message', newMessage.val())
    newMessage.val('')

    e.preventDefault()
  })

  // Waiting for user to submit message
  $('#imageSubmit').bind('change', e => {
    e.preventDefault()
    const file = e.originalEvent.target.files[0]
    const reader = new FileReader()
    reader.addEventListener('load', function (evt) {
      socket.emit('image submit', {img: this.result})
    })

    reader.readAsDataURL(file)
  })
}

$(document).ready(() => {
  handleChat()

  $('#emptyChat').click(() => {
    $('#messages').empty()
  })
})
