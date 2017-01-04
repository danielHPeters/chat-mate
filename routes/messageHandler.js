/**
 * Main chat module
 */

'use strict';

module.exports = function (io) {

    io.on('connection', function (socket) {
        console.log('a user connected');
        socket.on('chat message', function (msg) {
            console.log('message: ' + msg);
        });

        io.sockets.emit('hello message', {hello: 'Hello World'});

        socket.on('disconnect', function () {
            console.log('A user disconnected');
        });
    });

};