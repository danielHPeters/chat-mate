"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ChatServer_1 = require("../server/chat/ChatServer");
class ChatClient {
    constructor(ui) {
        this.ui = ui;
    }
    init() {
        const socket = io();
        this.registerSocketEvents(socket);
        this.registerFormEvents(socket);
    }
    registerSocketEvents(socket) {
        const connectFailMsg = { content: 'Connection Failed.', user: '' };
        const disconnectMsg = { content: 'You have been disconnected. Trying to reconnect.', user: '' };
        socket.on(ChatServer_1.SocketEvents.CLIENT_CONNECT, () => this.ui.namePrompt(name => socket.emit(ChatServer_1.SocketEvents.NEW_USER, name)));
        socket.on(ChatServer_1.SocketEvents.WELCOME, msg => this.ui.appendBoldText(msg));
        socket.on(ChatServer_1.SocketEvents.DISCONNECT, () => this.ui.appendBoldText(disconnectMsg));
        socket.on(ChatServer_1.SocketEvents.CONNECT_FAILED, () => this.ui.appendBoldText(connectFailMsg));
        socket.on(ChatServer_1.SocketEvents.USER_CONNECT, msg => this.ui.appendSimpleMessage(msg));
        socket.on(ChatServer_1.SocketEvents.USER_DISCONNECT, msg => this.ui.appendSimpleMessage(msg));
        socket.on(ChatServer_1.SocketEvents.MESSAGE, msg => this.ui.appendSimpleMessage(msg));
        socket.on(ChatServer_1.SocketEvents.IMAGE, msg => this.ui.appendImage(msg));
        socket.on(ChatServer_1.SocketEvents.CONNECTED_USERS, users => this.ui.refreshUserList(users));
    }
    registerFormEvents(socket) {
        const form = document.getElementById('chatForm');
        form.addEventListener('submit', event => {
            const message = document.getElementById('newMessage').value;
            socket.emit(ChatServer_1.SocketEvents.MESSAGE, message);
            form.reset();
            event.preventDefault();
        });
        document.getElementById('imageSubmit').addEventListener('change', e => {
            const file = document.getElementById('image').files[0];
            const reader = new FileReader();
            reader.addEventListener('load', evt => socket.emit(ChatServer_1.SocketEvents.IMAGE, { img: reader.result }));
            reader.readAsDataURL(file);
            e.preventDefault();
        });
    }
}
exports.default = ChatClient;
