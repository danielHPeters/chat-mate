"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validator = require("validator");
var SocketEvents;
(function (SocketEvents) {
    SocketEvents["CONNECTION"] = "connection";
    SocketEvents["CLIENT_CONNECT"] = "connect";
    SocketEvents["DISCONNECT"] = "disconnect";
    SocketEvents["CONNECT_FAILED"] = "connect_failed";
    SocketEvents["NEW_USER"] = "new-user";
    SocketEvents["WELCOME"] = "welcome";
    SocketEvents["USER_CONNECT"] = "user-connect";
    SocketEvents["USER_DISCONNECT"] = "user-diconnect";
    SocketEvents["CONNECTED_USERS"] = "connected-users";
    SocketEvents["MESSAGE"] = "message";
    SocketEvents["IMAGE"] = "image";
})(SocketEvents = exports.SocketEvents || (exports.SocketEvents = {}));
class ChatServer {
    constructor(io) {
        this.io = io;
        this.users = [];
    }
    init() {
        this.io.on(SocketEvents.CONNECTION, socket => {
            this.sendMessages(socket);
            this.addUser(socket);
            this.sendImages(socket);
            this.removeUser(socket);
        });
    }
    addUser(socket) {
        socket.on(SocketEvents.NEW_USER, user => {
            if (user !== '' && user !== null) {
                socket.emit(SocketEvents.WELCOME, { user, content: 'Welcome to ChatMate ' });
                socket['username'] = user;
                socket.broadcast.emit(SocketEvents.USER_CONNECT, { user: socket['username'], content: ' came online.' });
                this.users.push({ name: socket['username'], id: socket.id });
                this.io.emit(SocketEvents.CONNECTED_USERS, this.users);
            }
            else {
                socket.disconnect();
            }
        });
    }
    sendMessages(socket) {
        socket.on(SocketEvents.MESSAGE, msg => {
            if (msg !== '') {
                if (msg.length > 100) {
                    msg = msg.substring(0, 120);
                }
                msg = validator.escape(msg);
                this.io.emit(SocketEvents.MESSAGE, { user: socket['username'], content: msg });
            }
        });
    }
    sendImages(socket) {
        socket.on(SocketEvents.IMAGE, data => this.io.emit(SocketEvents.IMAGE, { user: socket['username'], img: data.img }));
    }
    removeUser(socket) {
        socket.on(SocketEvents.DISCONNECT, () => {
            socket.broadcast.emit(SocketEvents.USER_DISCONNECT, { user: socket['username'], content: ' left the chat.' });
            for (let i = 0; i < this.users.length; i++) {
                if (this.users[i].id === socket.id) {
                    this.users.splice(i, 1);
                }
            }
            this.io.emit(SocketEvents.CONNECTED_USERS, this.users);
        });
    }
}
exports.default = ChatServer;
