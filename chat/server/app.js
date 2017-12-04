let ChatServer = require('./ChatServer')
module.exports = io => {
  let chat = new ChatServer(io)
  chat.init()
}
