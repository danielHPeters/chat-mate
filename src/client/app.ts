import ChatClient from './ChatClient'
import WebUi from './WebUi'

document.addEventListener('DOMContentLoaded', event => {
  $('.dropify')['dropify']()

  const ui = new WebUi('messages')
  const client = new ChatClient(ui)
  client.init()
})
