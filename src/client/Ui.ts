import ChatMessage from './ChatMessage'
import User from './User'

/**
 * Chat ui interface.
 *
 * @author Daniel Peters
 * @version 1.0
 */
export default interface Ui {

  /**
   *
   * @param callback
   */
  namePrompt (callback: (name: string) => void): void

  /**
   *
   * @param msg
   */
  appendSimpleMessage (msg: ChatMessage): void

  /**
   *
   * @param msg
   */
  appendBoldText (msg: ChatMessage): void

  /**
   *
   * @param msg
   */
  appendImage (msg: ChatMessage): void

  /**
   *
   * @param users
   */
  refreshUserList (users: User[]): void
}
