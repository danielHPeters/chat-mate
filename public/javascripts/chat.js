/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
const socket = io();


$(document).ready(function () {
    
    $('.chat').submit(function () {
        socket.emit('chat message', $('#newMessage').val());
        $('#newMessage').val('');
        return false;
    });
    
    socket.on('hello message', function (msg) {
        alert(msg);
    });
    
});