'use strict'

export default class ChatClient {
  constructor () {
    this.messageElement = document.getElementById('messages')
  }

  getUsername (callback) {
    let username = ''

    do {
      username = prompt('What\'s your username?')
    } while (username === '' || username === null || username === undefined)

    callback(username)
  }

  scrollDown () {
    this.messageElement.animate({scrollTop: this.messageElement.prop('scrollHeight')}, 0)
  }

  appendToMessages (text) {
    let li = document.createElement('li')
    li.classList.add('collection-item')
    li.appendChild(document.createTextNode(text))
    this.messageElement.appendChild(li)
    this.scrollDown()
  }

  handleChat () {
    const socket = io()
    const events = ['hello message', 'user disconnect', 'user connect']
    let username = ''

    socket.on('connect', () => {
      this.getUsername(name => {
        username = name
        socket.emit('little_newbie', username)
      })
    })

    events.forEach(event => {
      socket.on(event, msg => {
        this.appendToMessages(msg.content)
      })
    })

    socket.on('chat message', msg => {
      this.appendToMessages('<strong>' + msg.user + '</strong>: ' + msg.content)
    })

    socket.on('disconnect', () => {
      this.appendToMessages('<strong>You have been disconnected. Trying to reconnect.</strong>')
    })

    socket.on('online users', users => {
      $('#userList').empty()

      users.forEach(user => {
        $('#userList').append($('<div class="chip">').text(user.name))
      })
    })

    socket.on('connect_failed', () => {
      this.appendToMessages('<strong>Connection Failed</strong>')
    })

    socket.on('user image',
      data => {
        if (data.img) {
          this.appendToMessages(
            '<strong>' + data.user + '</strong>: ' + '' +
            '<img class="responsive-img" src="' + data.img + '"/>'
          )
        }
      }
    )

    const form = document.querySelector('.chat')
    form.addEventListener('submit', event => {
      const message = document.getElementById('ewMessage').value
      socket.emit('chat message', message)
      form.reset()
      event.preventDefault()
    })

    // Waiting for user to submit message
    document.getElementById('imageSubmit').addEventListener('change', e => {
      e.preventDefault()
      const file = e.originalEvent.target.files[0]
      const reader = new FileReader()
      reader.addEventListener('load', function (evt) {
        socket.emit('image submit', {img: this.result})
      })

      reader.readAsDataURL(file)
    })
  }
}
