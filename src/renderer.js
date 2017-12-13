const electron = require('electron')
const opn = require('opn')
const currentWindow = electron.remote.getCurrentWindow()
const Mousetrap = require('mousetrap')
let url = null
const browserList = document.getElementById('browserList')
const urlField = document.getElementById('url')

const closeWindow = () => {
  urlField.innerText = ''

  setTimeout(() => {
    // if not paused, escape causes an audible error (beep). Presumably there's some sort of race condition here. Anyway, the timeout seems to solve it.
    currentWindow.hide()
    url = null
  }, 0)
}

// Listen for URL
electron.ipcRenderer.on('incomingURL', (event, message) => {
  urlField.innerText = message
  url = message
  currentWindow.show()
})

electron.ipcRenderer.on('incomingBrowsers', (event, message) => {
  emptiesPicker()
  populatePicker(message)
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

const emptiesPicker = () => {
  while (browserList.firstChild) {
    browserList.removeChild(browserList.firstChild)
  }
}

const populatePicker = installedBrowsers => {
  if (installedBrowsers.length > 0) {
    // Populate installedBrowsers

    currentWindow.setSize(
      400,
      installedBrowsers.filter(browser => browser.enabled).length * 64 + 48
    )

    installedBrowsers
      .filter(browser => browser.enabled)
      .map(browser => {
        // use alias as label if available, otherwise use name
        if (!browser.alias) {
          browser.alias = browser.name
        }
        return browser
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

        listItem.addEventListener('click', () => {
          listItem.classList.remove('active')
          openBrowser(browser.name)
        })
        listItem.addEventListener('mouseenter', () => {
          listItem.classList.add('active')
        })
        listItem.addEventListener('mouseleave', () => {
          listItem.classList.remove('active')
        })

        browserList.appendChild(listItem)

        Mousetrap.bind(browser.key, () => {
          listItem.classList.add('active')
          setTimeout(() => {
            listItem.classList.remove('active')
            openBrowser(browser.name)
          }, 200)
        })
      })
  } else {
    const listItem = document.createElement('li')

    listItem.innerText = 'Loading...'

    browserList.appendChild(listItem)
    currentWindow.setSize(400, 64 + 48)
  }
}
