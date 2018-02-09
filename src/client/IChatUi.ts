import IChatMessage from './IChatMessage'
import IUser from './IUser'

/**
 * Chat ui interface.
 *
 * @author Daniel Peters
 * @version 1.0
 */
export default interface IChatUi {

  /**
   *
   * @param callback
   */
  namePrompt (callback: (name: string) => void): void

  /**
   *
   * @param {IChatMessage} msg
   */
  appendSimpleMessage (msg: IChatMessage): void

  /**
   *
   * @param {IChatMessage} msg
   */
  appendBoldText (msg: IChatMessage): void

  /**
   *
   * @param {IChatMessage} msg
   */
  appendImage (msg: IChatMessage): void

  /**
   *
   * @param {IUser[]} users
   */
  refreshUserList (users: IUser[]): void
}
