import ChatClient from './ChatClient'

$('.dropify').dropify()

const client = new ChatClient('messages')
client.init()
