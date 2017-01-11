/* jshint browser:true, jquery:true, esversion:6 */

/**
 * Client side chat module
 *
 */


function getUsername(){
    let username = '';
    while (username === '' || username === null || username === undefined) {
        username = prompt('What\'s your username?');
    }
    return username;
}

$(document).ready(function () {
    'use strict';
    const socket = io();
    const events = ['hello message', 'user disconnect', 'user connect'];
    let username = '';

    username = getUsername();

    socket.on('connect', function () {
        socket.emit('little_newbie', username);
    });


    events.forEach(function (event) {
        socket.on(event, function (msg) {
            $('#messages').append($('<li class="list-group-item">').html(msg.content));
        });
    });

    socket.on('chat message', function (msg) {
        $('#messages').append(
            $('<li class="list-group-item">').html('<strong>' +
            msg.user + '</strong>: ' + msg.content)
        );
    });

    socket.on('disconnect', function () {
        $('#messages').append($('<li class="list-group-item">').html(
            '<strong>You have been disconnected. Trying to reconnect.</strong>')
        );
    });

    socket.on('online users', function (users) {
        $('#userList').empty();
        users.forEach(function (user) {
            $('#userList').append($('<li class="list-group-item">').text(user.name));
        });
    });

    socket.on('connect_failed', function () {
        $('#messages').append(
            $('<li class="list-group-item">').html('<strong>Connection Failed</strong>')
        );
    });

    // Waiting for user to submit message
    $('.chat').submit(function () {
        socket.emit('chat message', $('#newMessage').val());
        $('#newMessage').val('');

        // Prevent form from default submit
        return false;
    });

    $('#emptyChat').click(function(){
        $('#messages').empty();
    });

});