/* jshint node:true, esversion:6 */
/**
 * socket.io module
 */

/**
 * File Handler
 */
const fs = require('fs');

/**
 * Html sanitizer
 */
const validator = require('validator');

let users = [];

// event list
const sockEvents = {
    newuser: 'little_newbie',
    hello: 'hello message',
    conn: 'user connect',
    chat: 'chat message',
    online: 'online users',
    disconn: 'user disconnect',
    image: 'image submit'
};

/**
 * 
 */
function chatMessages(io, socket) {
    // Listener for chat event.
    socket.on(sockEvents.chat, function (msg) {
        if (msg !== '') {

            if (msg.length > 100) {
                msg = msg.substring(0, 120);
            }

            msg = validator.escape(msg);

            io.emit(sockEvents.chat, { user: socket.username, content: msg });
        }
    });
}

/**
 * 
 */
function newUser(io, socket) {
    socket.on(sockEvents.newuser, function (username) {

        if (username !== '' && username !== null) {

            socket.emit(
                sockEvents.hello,
                {
                    content: 'Welcome to ChatMate <strong>' +
                    username + '</strong>'
                }
            );

            socket.username = username;

            socket.broadcast.emit(
                sockEvents.conn,
                { content: '<strong>' + socket.username + '</strong> came online.' }
            );

            users.push({ name: socket.username, id: socket.id });

            io.emit(sockEvents.online, users);

        } else {
            socket.disconnect();
        }

    });
}

/**
 * 
 */
function imageSubmit(io, socket) {
    // Listener for image submit
    socket.on(sockEvents.image, function (data) {
        io.emit(sockEvents.image, { user: socket.username, img: data.img });
    });
}

function userDisconnect(io, socket) {
    // Disconnect listener
    socket.on('disconnect', function () {

        socket.broadcast.emit(
            sockEvents.disconn,
            {
                content: '<strong>' + socket.username +
                '</strong> left the chat.'
            }
        );

        for (let i = 0; i < users.length; i++) {
            if (users[i].id === socket.id) {
                users.splice(i, 1);
            }
        }

        io.emit(sockEvents.online, users);

    });
}

/**
 * 
 * @param {type} io
 * @returns {undefined}
 */
module.exports = function (io) {

    io.on('connection', function (socket) {



        chatMessages(io, socket);

        newUser(io, socket);

        imageSubmit(io, socket);

        userDisconnect(io, socket);


    });
};
