"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ChatClient_1 = require("./ChatClient");
const ChatUi_1 = require("./ChatUi");
$('.dropify')['dropify']();
const ui = new ChatUi_1.default('messages');
const client = new ChatClient_1.default(ui);
client.init();
