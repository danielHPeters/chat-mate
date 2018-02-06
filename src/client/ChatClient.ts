import { SocketEvents } from '../server/chat/ChatServer'

/**
 * Chat client class.
 *
 * @author Daniel Peters
 * @version 1.0
 */
export default class ChatClient {
  private element: HTMLDivElement

  /**
   * Constructor.
   *
   * @param {string} id
   */
  constructor (id: string) {
    this.element = document.getElementById(id) as HTMLDivElement
  }

  /**
   * Get username using a prompt. Waits until user submits a valid username.
   *
   * @param callback
   */
  getUsername (callback): void {
    let username = ''

    do {
      username = prompt('What\'s your username?')
    } while (username === '' || username === null || username === undefined)

    callback(username)
  }

  /**
   * Scroll to the bottom of the chat.
   */
  scrollDown (): void {
    this.element.scrollTop = this.element.scrollHeight
  }

  /**
   * Append an item to the messages collection.
   *
   * @param {HTMLElement[]} elements
   */
  appendMessage (elements: HTMLElement[]): void {
    let li = document.createElement('li')
    li.classList.add('collection-item')
    elements.forEach(element => li.appendChild(element))
    this.element.appendChild(li)
    this.scrollDown()
  }

  /**
   *
   */
  init (): void {
    const socket = io()
    let username = ''

    socket.on(SocketEvents.CLIENT_CONNECT, () => {
      this.getUsername(name => {
        username = name
        socket.emit(SocketEvents.NEW_USER, username)
      })
    })

    socket.on(SocketEvents.WELCOME, msg => {
      const strong = document.createElement('strong')
      const span = document.createElement('span')
      strong.appendChild(document.createTextNode(msg.user))
      span.appendChild(document.createTextNode(msg.content))
      this.appendMessage([span, strong])
    })

    socket.on(SocketEvents.USER_CONNECT, msg => {
      const strong = document.createElement('strong')
      const span = document.createElement('span')
      strong.appendChild(document.createTextNode(msg.user))
      span.appendChild(document.createTextNode(msg.content))
      this.appendMessage([strong, span])
    })

    socket.on(SocketEvents.USER_DISCONNECT, msg => {
      const strong = document.createElement('strong')
      const span = document.createElement('span')
      strong.appendChild(document.createTextNode(msg.user))
      span.appendChild(document.createTextNode(msg.content))
      this.appendMessage([strong, span])
    })

    socket.on(SocketEvents.MESSAGE, msg => {
      const strong = document.createElement('strong')
      strong.appendChild(document.createTextNode(msg.user))
      const span = document.createElement('span')
      span.appendChild(document.createTextNode(': ' + msg.content))
      this.appendMessage([strong, span])
    })

    socket.on(SocketEvents.DISCONNECT, () => {
      const strong = document.createElement('strong')
      strong.appendChild(document.createTextNode('You have been disconnected. Trying to reconnect.'))
      this.appendMessage([strong])
    })

    socket.on(SocketEvents.CONNECTED_USERS, users => {
      const userList = document.getElementById('userList')
      userList.innerHTML = ''

      users.forEach(user => {
        const chip = document.createElement('div')
        chip.classList.add('chip')
        chip.appendChild(document.createTextNode(user.name))
        userList.appendChild(chip)
      })
    })

    socket.on(SocketEvents.CONNECT_FAILED, () => {
      const strong = document.createElement('strong')
      strong.appendChild(document.createTextNode('Connection Failed.'))
      this.appendMessage([strong])
    })

    socket.on(SocketEvents.IMAGE,
      data => {
        if (data.img) {
          const strong = document.createElement('strong')
          const span = document.createElement('span')
          const img = document.createElement('img')
          img.classList.add('responsive-img')
          img.src = data.img
          strong.appendChild(document.createTextNode(data.user))
          span.appendChild(document.createTextNode(': '))
          this.appendMessage([strong, span, img])
        }
      }
    )

    const form = document.getElementById('chat') as HTMLFormElement
    form.addEventListener('submit', event => {
      const message = (document.getElementById('newMessage')as HTMLInputElement).value
      socket.emit(SocketEvents.MESSAGE, message)
      form.reset()
      event.preventDefault()
    })

    // Waiting for user to submit message
    document.getElementById('imageSubmit').addEventListener('change', e => {
      e.preventDefault()
      const file = (document.getElementById('image') as HTMLInputElement).files[0]
      const reader = new FileReader()
      reader.addEventListener('load', evt => {
        socket.emit(SocketEvents.IMAGE, { img: reader.result })
      })

      reader.readAsDataURL(file)
    })
  }
}
