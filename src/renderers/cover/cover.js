import { remote } from 'electron'

window.onclick = function() {
  setTimeout(() => {
    remote.app.hide()
  }, 0)
}
