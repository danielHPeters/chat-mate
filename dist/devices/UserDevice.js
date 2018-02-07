"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserDevice {
    constructor(constraints) {
        this.constraints = constraints;
    }
    init(id) {
        navigator.mediaDevices.getUserMedia(this.constraints)
            .then((mediaStream) => {
            const video = document.getElementById(id);
            this._stream = mediaStream;
            video.srcObject = mediaStream;
            video.onloadedmetadata = (ev => video.play());
        })
            .catch((err) => console.log(err.name + ': ' + err.message));
    }
    get stream() {
        return this._stream;
    }
    set stream(stream) {
        this._stream = stream;
    }
}
exports.default = UserDevice;
