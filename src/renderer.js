const electron = require('electron')
const opn = require('opn')
const currentWindow = electron.remote.getCurrentWindow()
let url = null

// Listen for URL
electron.ipcRenderer.on('incomingURL', (event, message) => {
  const urlField = document.getElementById('url')
  urlField.innerText = message
  url = message
})

const openBrowser = appName =>
  opn(url, { app: appName, wait: false })
    .then(() => {
      currentWindow.hide()
      url = null
    })
    .catch(() =>
      alert(
        'Oh no! An error just occurred, please report this as a  GitHub issue. Opened URL was ' +
          url
      )
    )

// Listen for installedBrowsers
electron.ipcRenderer.on('installedBrowsers', (event, installedBrowsers) => {
  const browserList = document.getElementById('browserList')
  document.getElementById('loading').style.display = 'none'
  installedBrowsers.map(browser => {
    const listItem = document.createElement('li')
    const browserLogo = document.createElement('img')
    browserLogo.src = `images/browser-logos/${browser}.png`
    listItem.appendChild(browserLogo)

    const browserName = document.createElement('span')
    browserName.innerText = browser
    listItem.appendChild(browserName)

    listItem.addEventListener('click', () => openBrowser(browser))
    browserList.appendChild(listItem)
  })
})
