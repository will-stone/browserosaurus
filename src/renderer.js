const electron = require('electron')
const opn = require('opn')
const currentWindow = electron.remote.getCurrentWindow()
let url = null

// electron.ipcRenderer.send('pickerReady', 1)

// electron.ipcRenderer.on('async-reply', (event, arg) => {
//   // Print 2
//   console.log(arg);
//   // Send sync message to main process
//   let mainValue = ipcRenderer.sendSync('sync', 3);
//   // Print 4
//   console.log(mainValue);
// });

// Listen for URL
electron.ipcRenderer.on('incomingURL', (event, message) => (url = message))

const openBrowser = appName =>
  opn(url, { app: appName, wait: false })
    .then(t => {
      currentWindow.hide()
      url = null
    })
    .catch(e =>
      alert(
        'Oh no! An error just occurred, please report this as a  GitHub issue. Opened URL was ' +
          url
      )
    )

// Listen for installedBrowsers
electron.ipcRenderer.on('installedBrowsers', (event, installedBrowsers) => {
  installedBrowsers.map(browser => {
    document.getElementById('loading').style.display = 'none'
    const button = document.createElement('button')
    const browserLogo = document.createElement('img')
    browserLogo.src = `images/browser-logos/${browser}.png`
    button.appendChild(browserLogo)
    document.body.appendChild(button)
    button.addEventListener('click', () => openBrowser(browser))
  })
})
