const electron = require('electron')
const browserList = document.getElementById('browserList')

const currentWindow = electron.remote.getCurrentWindow()

const toggleBrowser = browserName =>
  electron.ipcRenderer.send('toggle-browser', browserName)

currentWindow.installedBrowsers
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

    listItem.addEventListener('click', () => {
      toggleBrowser(browser.name)
    })

    listItem.addEventListener('mouseenter', () => {
      listItem.classList.add('active')
    })
    listItem.addEventListener('mouseleave', () => {
      listItem.classList.remove('active')
    })

    if (browser.enabled) {
      listItem.classList.add('is-enabled')
    }

    browserList.appendChild(listItem)
  })
