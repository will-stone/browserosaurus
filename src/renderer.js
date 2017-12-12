const electron = require('electron')
const opn = require('opn')
const currentWindow = electron.remote.getCurrentWindow()
const Mousetrap = require('mousetrap')
let url = null
const browserList = document.getElementById('browserList')

const closeWindow = () => {
  document.body.classList.remove('is-open')
  currentWindow.hide()
  url = null
}

// Listen for URL
electron.ipcRenderer.on('incomingURL', (event, message) => {
  const urlField = document.getElementById('url')
  urlField.innerText = message
  url = message
})

electron.ipcRenderer.on('open', () => {
  document.body.classList.add('is-open')
})

electron.ipcRenderer.on('close', () => {
  closeWindow()
})

Mousetrap.bind('esc', () => {
  closeWindow()
})

const openBrowser = appName =>
  opn(url, { app: appName, wait: false })
    .then(() => closeWindow())
    .catch(() =>
      alert(
        'Oh no! An error just occurred, please report this as a  GitHub issue. Opened URL was ' +
          url
      )
    )

// Listen for installedBrowsers
electron.ipcRenderer.on('installedBrowsers', (event, installedBrowsers) => {
  document.getElementById('loading').style.display = 'none'
  installedBrowsers
    .map(browser => {
      // use alias as label if available, otherwise use name
      if (!browser.alias) {
        browser.alias = browser.name
      }
      return browser
    })
    .sort((a, b) => {
      // alphabetise
      if (a.alias < b.alias) return -1
      if (a.alias > b.alias) return 1
      return 0
    })
    .map(browser => {
      const listItem = document.createElement('li')

      const browserLogo = document.createElement('img')
      browserLogo.classList.add('browserLogo')
      browserLogo.src = `images/browser-logos/${browser.name}.png`
      listItem.appendChild(browserLogo)

      const browserName = document.createElement('span')
      browserName.classList.add('browserName')
      browserName.innerText = browser.alias
      listItem.appendChild(browserName)

      const browserKey = document.createElement('span')
      browserKey.classList.add('browserKey')
      browserKey.innerText = browser.key
      listItem.appendChild(browserKey)

      listItem.addEventListener('click', () => openBrowser(browser.name))
      browserList.appendChild(listItem)

      Mousetrap.bind(browser.key, () => {
        listItem.classList.add('active')
        setTimeout(() => {
          openBrowser(browser.name)
          listItem.classList.remove('active')
        }, 200)
      })
    })
})
