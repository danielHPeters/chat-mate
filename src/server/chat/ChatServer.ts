import * as validator from 'validator'

export enum SocketEvents {
  CONNECTION = 'connection',
  CLIENT_CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  CONNECT_FAILED = 'connect_failed',
  NEW_USER = 'new-user',
  WELCOME = 'welcome',
  USER_CONNECT = 'user-connect',
  USER_DISCONNECT = 'user-diconnect',
  CONNECTED_USERS = 'connected-users',
  MESSAGE = 'message',
  IMAGE = 'image'
}

/**
 * ChatServer class
 *
 * @author Daniel Peters
 * @version 1.0
 */
export default class ChatServer {
  private io: SocketIO.Server
  private users

  /**
   * Constructor.
   *
   * @param {SocketIO.Server} io
   */
  constructor (io: SocketIO.Server) {
    this.io = io
    this.users = []
  }

  /**
   * Initialize all server listeners.
   */
  init (): void {
    this.io.on(SocketEvents.CONNECTION, socket => {
      this.sendMessages(socket)
      this.addUser(socket)
      this.sendImages(socket)
      this.removeUser(socket)
    })
  }

  /**
   * Add a user on connection.
   *
   * @param {SocketIO.Socket} socket
   */
  addUser (socket: SocketIO.Socket): void {
    socket.on(SocketEvents.NEW_USER, user => {
      if (user !== '' && user !== null) {
        socket.emit(SocketEvents.WELCOME, { user, content: 'Welcome to ChatMate ' })

        socket['username'] = user
        socket.broadcast.emit(SocketEvents.USER_CONNECT, { user: socket['username'], content: ' came online.' })
        this.users.push({ name: socket['username'], id: socket.id })
        this.io.emit(SocketEvents.CONNECTED_USERS, this.users)
      } else {
        socket.disconnect()
      }
    })
  }

  /**
   * Send messages to all clients.
   *
   * @param {SocketIO.Socket} socket
   */
  sendMessages (socket: SocketIO.Socket): void {
    socket.on(SocketEvents.MESSAGE, msg => {
      if (msg !== '') {
        if (msg.length > 100) {
          msg = msg.substring(0, 120)
        }
        msg = validator.escape(msg)
        this.io.emit(SocketEvents.MESSAGE, { user: socket['username'], content: msg })
      }
    })
  }

  /**
   * Send submitted images to all clients.
   *
   * @param {SocketIO.Socket} socket
   */
  sendImages (socket: SocketIO.Socket): void {
    socket.on(SocketEvents.IMAGE, data => this.io.emit(SocketEvents.IMAGE, { user: socket['username'], img: data.img }))
  }

  /**
   * Remove a user on disconnect.
   *
   * @param {SocketIO.Socket} socket
   */
  removeUser (socket: SocketIO.Socket): void {
    socket.on(SocketEvents.DISCONNECT, () => {
      socket.broadcast.emit(SocketEvents.USER_DISCONNECT, { user: socket['username'], content: ' left the chat.' })

      for (let i = 0; i < this.users.length; i++) {
        if (this.users[i].id === socket.id) {
          this.users.splice(i, 1)
        }
      }
      this.io.emit(SocketEvents.CONNECTED_USERS, this.users)
    })
  }
}
