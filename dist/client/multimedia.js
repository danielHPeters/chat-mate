"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserDevice_1 = require("../devices/UserDevice");
const device = new UserDevice_1.default({ audio: true, video: true });
device.init('video');
