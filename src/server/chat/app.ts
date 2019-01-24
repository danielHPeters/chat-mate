import ChatServer from './ChatServer'
import { Server } from 'socket.io'

export default function (io: Server) {
  let chat = new ChatServer(io)
  chat.init()
}
