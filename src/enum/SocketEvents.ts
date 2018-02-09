/**
 * Socket events enum.
 *
 * @author Daniel Peters
 * @version 1.0
 */
export enum SocketEvents {
  CONNECTION = 'connection',
  CLIENT_CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  CONNECT_FAILED = 'connect_failed',
  NEW_USER = 'new-user',
  WELCOME = 'welcome',
  USER_CONNECT = 'user-connect',
  USER_DISCONNECT = 'user-disconnect',
  CONNECTED_USERS = 'connected-users',
  MESSAGE = 'message',
  IMAGE = 'image'
}
