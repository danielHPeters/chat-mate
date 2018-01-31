const validator = require('validator')

/**
 *
 * @type {module.ChatServer}
 */
module.exports = class ChatServer {
  constructor (io) {
    this.io = io
    this.users = []
    this.events = {
      newUser: 'little_newbie',
      hello: 'hello message',
      conn: 'user connect',
      chat: 'chat message',
      online: 'online users',
      disconnect: 'user disconnect',
      image: 'imageSubmit'
    }
  }

  init () {
    this.io.on('connection', socket => {
      this.sendMessages(socket)
      this.addUser(socket)
      this.sendImages(socket)
      this.removeUser(socket)
    })
  }

  addUser (socket) {
    socket.on(this.events.newUser, username => {
      if (username !== '' && username !== null) {
        socket.emit(this.events.hello, {content: 'Welcome to ChatMate <strong>' + username + '</strong>'})

        socket.username = username
        socket.broadcast.emit(this.events.conn, {content: '<strong>' + socket.username + '</strong> came online.'})
        this.users.push({name: socket.username, id: socket.id})
        this.io.emit(this.events.online, this.users)
      } else {
        socket.disconnect()
      }
    })
  }

  sendMessages (socket) {
    socket.on(this.events.chat, msg => {
      if (msg !== '') {
        if (msg.length > 100) {
          msg = msg.substring(0, 120)
        }
        msg = validator.escape(msg)
        this.io.emit(this.events.chat, {user: socket.username, content: msg})
      }
    })
  }

  sendImages (socket) {
    socket.on('image submit', data => this.io.emit('user image', {user: socket.username, img: data.img}))
  }

  removeUser (socket) {
    socket.on('disconnect', () => {
      socket.broadcast.emit(this.events.disconnect, {content: '<strong>' + socket.username + '</strong> left the chat.'})

      for (let i = 0; i < this.users.length; i++) {
        if (this.users[i].id === socket.id) {
          this.users.splice(i, 1)
        }
      }
      this.io.emit(this.events.online, this.users)
    })
  }
}
