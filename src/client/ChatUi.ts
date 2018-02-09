import IChatUi from './IChatUi'
import IChatMessage from './IChatMessage'
import IUser from './IUser'

/**
 * Chat ui implementation class.
 *
 * @author Daniel Peters
 * @version 1.0
 */
export default class ChatUi implements IChatUi {
  private element: HTMLDivElement

  /**
   * Constructor.
   *
   * @param {string} id ID of the chat display element
   */
  constructor (id: string) {
    this.element = document.getElementById(id) as HTMLDivElement
  }

  /**
   * Get username using a prompt. Waits until user submits a valid username.
   *
   * @param {(name: string) => void} callback Callback executed after user submits a valid name.
   */
  public namePrompt (callback: (name: string) => void): void {
    let username = ''

    do {
      username = prompt('What\'s your username?')
    } while (username === '' || username === null || username === undefined)

    callback(username)
  }

  /**
   * Add a message with username in bold and message in lowercase.
   *
   * @param {IChatMessage} msg Chat message
   */
  public appendSimpleMessage (msg: IChatMessage): void {
    const strong = document.createElement('strong')
    const span = document.createElement('span')
    strong.appendChild(document.createTextNode(msg.user))
    span.appendChild(document.createTextNode(msg.content))
    this.appendMessage([strong, span])
  }

  /**
   * Add a bold message to the chat area.
   *
   * @param {IChatMessage} msg Chat message
   */
  public appendBoldText (msg: IChatMessage): void {
    const strong = document.createElement('strong')
    strong.appendChild(document.createTextNode(msg.content))
    this.appendMessage([strong])
  }

  /**
   *
   * @param {IChatMessage} msg Chat message
   */
  public appendImage (msg: IChatMessage): void {
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
   * @param {IUser[]} users List of online users
   */
  public refreshUserList (users: IUser[]): void {
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
   * @param {HTMLElement[]} elements html elements.
   */
  private appendMessage (elements: HTMLElement[]): void {
    let li = document.createElement('li')
    li.classList.add('collection-item')
    elements.forEach(element => li.appendChild(element))
    this.element.appendChild(li)
    this.scrollDown()
  }

}
