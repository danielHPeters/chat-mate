import UserDevice from '../devices/UserDevice'

document.addEventListener('DOMContentLoaded', event => {
  const device = new UserDevice({ audio: true, video: true })
  device.init('video')
})
