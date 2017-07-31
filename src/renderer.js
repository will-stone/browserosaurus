const electron = require('electron')
const opn = require('opn')
const currentWindow = electron.remote.getCurrentWindow()
let url = null

// Listen for URL
electron.ipcRenderer.on('incomingURL', function(event, message) {
  url = message
})

const openBrowser = appName =>
  opn(url, { app: appName, wait: false })
    .then(t => {
      currentWindow.hide()
      url = null
    })
    .catch(e =>
      alert(
        'Oh no! An error just occurred, please report this as a  GitHub issue.'
      )
    )

// Listen for installedBrowsers
electron.ipcRenderer.on('installedBrowsers', (event, installedBrowsers) => {
  console.log(installedBrowsers)
  installedBrowsers.map(browser => {
    document.getElementById('loading').style.display = 'none'
    const button = document.createElement('button')
    const browserText = document.createTextNode(browser)
    button.appendChild(browserText)
    document.body.appendChild(button)
    button.addEventListener('click', () => openBrowser(browser))
  })
})
