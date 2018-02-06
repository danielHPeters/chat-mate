"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ChatClient_1 = require("./ChatClient");
$('.dropify').dropify();
const client = new ChatClient_1.default('messages');
client.init();
