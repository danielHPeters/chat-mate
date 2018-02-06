import ChatServer from './ChatServer'

export default function (io) {
  let chat = new ChatServer(io)
  chat.init()
}
