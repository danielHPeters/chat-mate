/* jshint browser:true, jquery:true, esversion:6 */

/**
 * Client side chat module
 *
 */


/**
 * 
 * @param {type} callback
 * @returns {undefined}
 */
function getUsername(callback) {

    let username = '';

    do  {
        username = prompt('What\'s your username?');
    } while (username === '' || username === null || username === undefined)

    callback(username);
}

/**
 * 
 * @type type
 */
$(document).ready(function () {
    'use strict';
    const socket = io();
    const events = ['hello message', 'user disconnect', 'user connect'];
    let username = '';

    

    socket.on('connect', function () {

        getUsername(function (name) {
            username = name;
            socket.emit('little_newbie', username);
        });

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

    socket.on('image submit', function (data) {
        if (data.img) {

            $('#messages').append($('<li class="list-group-item">').html(
                    '<strong>' + data.user + '</strong>: ' + '<img class="img-responsive" src="' +
                    data.img + '"/>'
                    ));

        }
    });



    // Waiting for user to submit message
    $('.chat').submit(function () {
        socket.emit('chat message', $('#newMessage').val());
        $('#newMessage').val('');

        // Prevent form from default submit
        return false;
    });

    // Waiting for user to submit message
    $('.imageSubmit').on('change', function (e) {
        const file = e.originalEvent.target.files[0];
        const reader = new FileReader();

        reader.onload = function (evt) {
            socket.emit('image submit', {img: evt.target.result});
        };

        reader.readAsDataURL(file);

    });

    $('#emptyChat').click(function () {
        $('#messages').empty();
    });

});