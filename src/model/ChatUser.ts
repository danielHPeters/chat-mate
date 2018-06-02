import User from '../client/User'

/**
 * User model class.
 *
 * @author Daniel Peters
 * @version 1.0
 */
export default class ChatUser implements User {
  id: string
  name: string
  email: string

  /**
   * Constructor.
   *
   * @param id
   * @param name
   * @param email
   */
  constructor (id: string, name: string, email: string = '') {
    this.id = id
    this.name = name
    this.email = email
  }
}
