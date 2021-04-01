import Ui from './Ui'
import ChatMessage from './ChatMessage'
import User from './User'

/**
 * Chat ui implementation class.
 *
 * @author Daniel Peters
 * @version 1.0
 */
export default class WebUi implements Ui {
  private element: HTMLDivElement

  /**
   * Constructor.
   *
   * @param id ID of the chat display element
   */
  constructor (id: string) {
    this.element = document.getElementById(id) as HTMLDivElement
  }

  /**
   * Get username using a prompt. Waits until user submits a valid username.
   *
   * @param callback Callback executed after user submits a valid name
   */
  namePrompt (callback: (name: string) => void): void {
    let username = ''

    do {
      username = prompt('What\'s your username?')
    } while (username === '' || username === null || username === undefined)

    callback(username)
  }

  /**
   * Add a message with username in bold and message in lowercase.
   *
   * @param msg Chat message
   */
  appendSimpleMessage (msg: ChatMessage): void {
    const strong = document.createElement('strong')
    const span = document.createElement('span')
    strong.appendChild(document.createTextNode(msg.user))
    span.appendChild(document.createTextNode(msg.content))
    this.appendMessage([strong, span])
  }

  /**
   * Add a bold message to the chat area.
   *
   * @param msg Chat message
   */
  appendBoldText (msg: ChatMessage): void {
    const strong = document.createElement('strong')
    strong.appendChild(document.createTextNode(msg.content))

    this.appendMessage([strong])
  }

  /**
   *
   * @param msg Chat message
   */
  appendImage (msg: ChatMessage): void {
    const strong = document.createElement('strong')
    const span = document.createElement('span')
    const img = document.createElement('img')

    img.classList.add('responsive-img')
    img.src = msg.content
    strong.appendChild(document.createTextNode(msg.user))
    span.appendChild(document.createTextNode(': '))
    this.appendMessage([strong, span, img])
  }

  /**
   * Refresh logged on user list.
   *
   * @param users List of online users
   */
  refreshUserList (users: User[]): void {
    const userList = document.getElementById('userList')

    userList.innerHTML = ''
    users.forEach(user => {
      const chip = document.createElement('div')
      chip.classList.add('chip')
      chip.appendChild(document.createTextNode(user.name))
      userList.appendChild(chip)
    })
  }

  /**
   * Scroll to the bottom of the chat.
   */
  private scrollDown (): void {
    this.element.scrollTop = this.element.scrollHeight
  }

  /**
   * Append an item to the messages collection.
   *
   * @param elements HTML elements
   */
  private appendMessage (elements: HTMLElement[]): void {
    const messageListItem = document.createElement('li')

    messageListItem.classList.add('collection-item')
    elements.forEach(element => messageListItem.appendChild(element))
    this.element.appendChild(messageListItem)
    this.scrollDown()
  }
}
