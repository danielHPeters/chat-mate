"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ChatServer_1 = require("../server/chat/ChatServer");
class ChatClient {
    constructor(id) {
        this.element = document.getElementById(id);
    }
    getUsername(callback) {
        let username = '';
        do {
            username = prompt('What\'s your username?');
        } while (username === '' || username === null || username === undefined);
        callback(username);
    }
    scrollDown() {
        this.element.scrollTop = this.element.scrollHeight;
    }
    appendMessage(elements) {
        let li = document.createElement('li');
        li.classList.add('collection-item');
        elements.forEach(element => li.appendChild(element));
        this.element.appendChild(li);
        this.scrollDown();
    }
    init() {
        const socket = io();
        let username = '';
        socket.on(ChatServer_1.SocketEvents.CLIENT_CONNECT, () => {
            this.getUsername(name => {
                username = name;
                socket.emit(ChatServer_1.SocketEvents.NEW_USER, username);
            });
        });
        socket.on(ChatServer_1.SocketEvents.WELCOME, msg => {
            const strong = document.createElement('strong');
            const span = document.createElement('span');
            strong.appendChild(document.createTextNode(msg.user));
            span.appendChild(document.createTextNode(msg.content));
            this.appendMessage([span, strong]);
        });
        socket.on(ChatServer_1.SocketEvents.USER_CONNECT, msg => {
            const strong = document.createElement('strong');
            const span = document.createElement('span');
            strong.appendChild(document.createTextNode(msg.user));
            span.appendChild(document.createTextNode(msg.content));
            this.appendMessage([strong, span]);
        });
        socket.on(ChatServer_1.SocketEvents.USER_DISCONNECT, msg => {
            const strong = document.createElement('strong');
            const span = document.createElement('span');
            strong.appendChild(document.createTextNode(msg.user));
            span.appendChild(document.createTextNode(msg.content));
            this.appendMessage([strong, span]);
        });
        socket.on(ChatServer_1.SocketEvents.MESSAGE, msg => {
            const strong = document.createElement('strong');
            strong.appendChild(document.createTextNode(msg.user));
            const span = document.createElement('span');
            span.appendChild(document.createTextNode(': ' + msg.content));
            this.appendMessage([strong, span]);
        });
        socket.on(ChatServer_1.SocketEvents.DISCONNECT, () => {
            const strong = document.createElement('strong');
            strong.appendChild(document.createTextNode('You have been disconnected. Trying to reconnect.'));
            this.appendMessage([strong]);
        });
        socket.on(ChatServer_1.SocketEvents.CONNECTED_USERS, users => {
            const userList = document.getElementById('userList');
            userList.innerHTML = '';
            users.forEach(user => {
                const chip = document.createElement('div');
                chip.classList.add('chip');
                chip.appendChild(document.createTextNode(user.name));
                userList.appendChild(chip);
            });
        });
        socket.on(ChatServer_1.SocketEvents.CONNECT_FAILED, () => {
            const strong = document.createElement('strong');
            strong.appendChild(document.createTextNode('Connection Failed.'));
            this.appendMessage([strong]);
        });
        socket.on(ChatServer_1.SocketEvents.IMAGE, data => {
            if (data.img) {
                const strong = document.createElement('strong');
                const span = document.createElement('span');
                const img = document.createElement('img');
                img.classList.add('responsive-img');
                img.src = data.img;
                strong.appendChild(document.createTextNode(data.user));
                span.appendChild(document.createTextNode(': '));
                this.appendMessage([strong, span, img]);
            }
        });
        const form = document.getElementById('chat');
        form.addEventListener('submit', event => {
            const message = document.getElementById('newMessage').value;
            socket.emit(ChatServer_1.SocketEvents.MESSAGE, message);
            form.reset();
            event.preventDefault();
        });
        document.getElementById('imageSubmit').addEventListener('change', e => {
            e.preventDefault();
            const file = document.getElementById('image').files[0];
            const reader = new FileReader();
            reader.addEventListener('load', evt => {
                socket.emit(ChatServer_1.SocketEvents.IMAGE, { img: reader.result });
            });
            reader.readAsDataURL(file);
        });
    }
}
exports.default = ChatClient;
