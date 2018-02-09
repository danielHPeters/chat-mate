import ChatClient from './ChatClient'
import ChatUi from './ChatUi'

$('.dropify')['dropify']()

const ui = new ChatUi('messages')
const client = new ChatClient(ui)
client.init()
