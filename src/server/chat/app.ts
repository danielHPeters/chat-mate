import ChatServer from './ChatServer'

export default function (io: SocketIO.Server) {
  let chat = new ChatServer(io)
  chat.init()
}
