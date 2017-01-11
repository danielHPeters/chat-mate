/* jshint browser:true, jquery:true, esversion:6 */

/**
 * Client side chat module
 *
 */
$(document).ready(function () {
    'use strict';
    const socket = io();
    const events = ['hello message', 'user disconnect', 'user connect'];
    let username = '';

    while (username === ''){
    username = prompt('What\'s your username?');
    }
    
    socket.on('connect', function () {
        socket.emit('little_newbie', username);
    });


    events.forEach(function (event) {
        socket.on(event, function (msg) {
            $('#messages').append($('<li class="list-group-item">').text(msg.content));
        });
    });

    socket.on('chat message', function (msg) {
        $('#messages').append(
            $('<li class="list-group-item">').text(msg.user + ': ' + msg.content)
        );
    });

    socket.on('disconnect', function () {
        $('#messages').append($('<li class="list-group-item">').text(
            'You have been disconnected. Trying to reconnect')
        );
    });

    socket.on('online users', function (users) {
        $('#userList').empty();
        users.forEach(function (user) {
            $('#userList').append($('<li class="list-group-item">').text(user.name));
        });
    });

    // Waiting for user to submit message
    $('.chat').submit(function () {
        socket.emit('chat message', $('#newMessage').val());
        $('#newMessage').val('');

        // Prevent form from default submit
        return false;
    });

});