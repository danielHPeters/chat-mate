"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ChatServer_1 = require("./ChatServer");
function default_1(io) {
    let chat = new ChatServer_1.default(io);
    chat.init();
}
exports.default = default_1;
