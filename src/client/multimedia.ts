import UserDevice from '../devices/UserDevice'

const device = new UserDevice({ audio: true, video: true })
device.init('video')
