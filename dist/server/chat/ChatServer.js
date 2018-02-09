"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validator = require("validator");
const User_1 = require("../../model/User");
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
                socket.emit(SocketEvents.WELCOME, { user, content: 'Welcome to ChatMate ' + user });
                socket['username'] = user;
                socket.broadcast.emit(SocketEvents.USER_CONNECT, { user, content: ' came online.' });
                this.users.push(new User_1.default(socket.id, user));
                this.io.emit(SocketEvents.CONNECTED_USERS, this.users);
            }
            else {
                socket.disconnect();
            }
            console.log(this.users);
        });
    }
    sendMessages(socket) {
        socket.on(SocketEvents.MESSAGE, msg => {
            msg = validator.escape(msg);
            if (msg !== '') {
                if (msg.length > 100) {
                    msg = msg.substring(0, 120);
                }
                this.io.emit(SocketEvents.MESSAGE, { user: socket['username'], content: ': ' + msg });
            }
        });
    }
    sendImages(socket) {
        socket.on(SocketEvents.IMAGE, data => this.io.emit(SocketEvents.IMAGE, {
            user: socket['username'],
            content: data.img
        }));
    }
    removeUser(socket) {
        socket.on(SocketEvents.DISCONNECT, () => {
            if (socket['username']) {
                socket.broadcast.emit(SocketEvents.USER_DISCONNECT, { user: socket['username'], content: ' left the chat.' });
                this.users = this.users.filter(user => user.id !== socket.id);
                this.io.emit(SocketEvents.CONNECTED_USERS, this.users);
            }
        });
    }
}
exports.default = ChatServer;
