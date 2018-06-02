/**
 * Accesses user media devices like microphone and streams the data.
 *
 * @author Daniel Peters
 * @version 1.0
 */
export default class UserDevice {
  private constraints
  private stream: MediaStream

  /**
   * Constructor.
   *
   * @param constraints
   */
  constructor (constraints) {
    this.constraints = constraints
  }

  /**
   * Initializing method.
   */
  init (id: string): void {
    navigator.mediaDevices.getUserMedia(this.constraints)
      .then((mediaStream) => {
        const video = document.getElementById(id) as HTMLVideoElement
        this.stream = mediaStream
        video.srcObject = mediaStream
        video.onloadedmetadata = (ev => video.play())
      })
      .catch((err) => console.log(err.name + ': ' + err.message))
  }
}
