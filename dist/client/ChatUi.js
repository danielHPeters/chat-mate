"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ChatUi {
    constructor(id) {
        this.element = document.getElementById(id);
    }
    namePrompt(callback) {
        let username = '';
        do {
            username = prompt('What\'s your username?');
        } while (username === '' || username === null || username === undefined);
        callback(username);
    }
    appendSimpleMessage(msg) {
        const strong = document.createElement('strong');
        const span = document.createElement('span');
        strong.appendChild(document.createTextNode(msg.user));
        span.appendChild(document.createTextNode(msg.content));
        this.appendMessage([strong, span]);
    }
    appendBoldText(msg) {
        const strong = document.createElement('strong');
        strong.appendChild(document.createTextNode(msg.content));
        this.appendMessage([strong]);
    }
    appendImage(msg) {
        const strong = document.createElement('strong');
        const span = document.createElement('span');
        const img = document.createElement('img');
        img.classList.add('responsive-img');
        img.src = msg.content;
        strong.appendChild(document.createTextNode(msg.user));
        span.appendChild(document.createTextNode(': '));
        this.appendMessage([strong, span, img]);
    }
    refreshUserList(users) {
        const userList = document.getElementById('userList');
        userList.innerHTML = '';
        users.forEach(user => {
            const chip = document.createElement('div');
            chip.classList.add('chip');
            chip.appendChild(document.createTextNode(user.name));
            userList.appendChild(chip);
        });
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
}
exports.default = ChatUi;
