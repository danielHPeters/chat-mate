import IUser from '../client/IUser'

/**
 * User model class.
 *
 * @author Daniel Peters
 * @version 1.0
 */
export default class User implements IUser {
  id: string
  name: string
  email: string

  /**
   * Constructor.
   *
   * @param {string} id
   * @param {string} name
   * @param {string} email
   */
  constructor (id: string, name: string, email = '') {
    this.id = id
    this.name = name
    this.email = email
  }
}
