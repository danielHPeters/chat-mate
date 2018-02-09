import * as validator from 'validator'
import User from '../../model/User'
import { SocketEvents } from '../../enum/SocketEvents'

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
        socket.emit(SocketEvents.WELCOME, { user, content: 'Welcome to ChatMate ' + user })
        socket['username'] = user
        socket.broadcast.emit(SocketEvents.USER_CONNECT, { user, content: ' came online.' })
        this.users.push(new User(socket.id, user))
        this.io.emit(SocketEvents.CONNECTED_USERS, this.users)
      } else {
        socket.disconnect()
      }
      console.log(this.users)
    })
  }

  /**
   * Send messages to all clients.
   *
   * @param {SocketIO.Socket} socket
   */
  sendMessages (socket: SocketIO.Socket): void {
    socket.on(SocketEvents.MESSAGE, msg => {
      msg = validator.escape(msg)
      if (msg !== '') {
        if (msg.length > 100) {
          msg = msg.substring(0, 120)
        }
        this.io.emit(SocketEvents.MESSAGE, { user: socket['username'], content: ': ' + msg })
      }
    })
  }

  /**
   * Send submitted images to all clients.
   *
   * @param {SocketIO.Socket} socket
   */
  sendImages (socket: SocketIO.Socket): void {
    socket.on(SocketEvents.IMAGE, data => this.io.emit(SocketEvents.IMAGE, {
      user: socket['username'],
      content: data.img
    }))
  }

  /**
   * Remove a user on disconnect.
   *
   * @param {SocketIO.Socket} socket
   */
  removeUser (socket: SocketIO.Socket): void {
    socket.on(SocketEvents.DISCONNECT, () => {
      if (socket['username']) {
        socket.broadcast.emit(SocketEvents.USER_DISCONNECT, { user: socket['username'], content: ' left the chat.' })
        this.users = this.users.filter(user => user.id !== socket.id)
        this.io.emit(SocketEvents.CONNECTED_USERS, this.users)
      }
    })
  }
}
