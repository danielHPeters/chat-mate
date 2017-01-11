/* jshint node:true, esversion:6 */
/**
 * socket.io module
 */

const fs = require('fs');

/**
 * 
 * @param {type} io
 * @returns {undefined}
 */
module.exports = function (io) {

    let users = [];

    io.on('connection', function (socket) {

        socket.on('little_newbie', function (username) {
            socket.emit('hello message', { content: 'Welcome to ChatMate ' + username});
            socket.username = username;
            socket.broadcast.emit('user connect', { content: socket.username + ' came online' });
            console.log(socket.username);
            users.push({ name: socket.username, id: socket.id });
        });

        console.log('A user connected');


        // Listener for chat event.
        socket.on('chat message', function (msg) {
            if (msg !== '') {
                io.emit('chat message', { user: socket.username, content: msg });
                console.log('message: ' + msg);
            }
        });

        socket.on('disconnect', function () {
            socket.broadcast.emit('user disconnect', { content: socket.username + ' left the chat' });
            console.log(socket.id + ' disconnected');

            for (let i = 0; i < users.length; i++) {
                if (users[i].id === socket.id) {
                    users.splice(i, 1);
                }
            }
            io.emit('online users', users);
        });

        io.emit('online users', users);
        console.log(users);

    });
};
