import Ui from './Ui'
import { SocketEvents } from '../enum/SocketEvents'

/**
 * Chat client class.
 *
 * @author Daniel Peters
 * @version 1.1
 */
export default class ChatClient {
  private ui: Ui

  /**
   * Constructor.
   *
   * @param ui Chat user interface
   */
  constructor (ui: Ui) {
    this.ui = ui
  }

  /**
   * Initialize all events.
   */
  init (): void {
    const socket = io()
    this.registerSocketEvents(socket)
    this.registerFormEvents(socket)
  }

  /**
   * Register all socket.io events.
   *
   * @param socket Socket instance
   */
  private registerSocketEvents (socket: SocketIOClient.Socket): void {
    const connectFailMsg = { content: 'Connection Failed.', user: '' }
    const disconnectMsg = { content: 'You have been disconnected. Trying to reconnect.', user: '' }

    socket.on(SocketEvents.CLIENT_CONNECT, () => this.ui.namePrompt(name => socket.emit(SocketEvents.NEW_USER, name)))
    socket.on(SocketEvents.WELCOME, msg => this.ui.appendBoldText(msg))
    socket.on(SocketEvents.DISCONNECT, () => this.ui.appendBoldText(disconnectMsg))
    socket.on(SocketEvents.CONNECT_FAILED, () => this.ui.appendBoldText(connectFailMsg))
    socket.on(SocketEvents.USER_CONNECT, msg => this.ui.appendSimpleMessage(msg))
    socket.on(SocketEvents.USER_DISCONNECT, msg => this.ui.appendSimpleMessage(msg))
    socket.on(SocketEvents.MESSAGE, msg => this.ui.appendSimpleMessage(msg))
    socket.on(SocketEvents.IMAGE, msg => this.ui.appendImage(msg))
    socket.on(SocketEvents.CONNECTED_USERS, users => this.ui.refreshUserList(users))
  }

  /**
   * Register all form submit and change events.
   *
   * @param socket Socket instance
   */
  private registerFormEvents (socket: SocketIOClient.Socket): void {
    const form = document.getElementById('chatForm') as HTMLFormElement
    form.addEventListener('submit', event => {
      const message = (document.getElementById('newMessage') as HTMLInputElement).value
      socket.emit(SocketEvents.MESSAGE, message)
      form.reset()
      event.preventDefault()
    })

    // Waiting for user to submit message
    document.getElementById('imageSubmit').addEventListener('change', e => {
      const file = (document.getElementById('image') as HTMLInputElement).files[0]
      const reader = new FileReader()
      reader.addEventListener('load', evt => socket.emit(SocketEvents.IMAGE, { img: reader.result }))
      reader.readAsDataURL(file)
      e.preventDefault()
    })
  }
}
