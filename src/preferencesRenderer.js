// Modules
const Sortable = require('sortablejs')
const electron = require('electron')

// Window
const currentWindow = electron.remote.getCurrentWindow()

// Elements
const navbar = document.getElementById('navbar')
const navItems = navbar.querySelectorAll('li')
const browsersTab = document.getElementById('browsers-tab')
const aboutTab = document.getElementById('about-tab')
const browserList = document.getElementById('browserList')
const about = document.getElementById('about')

// Version
const version = electron.remote.app.getVersion()
const bVersion = document.getElementById('browserosaurusVersion')
bVersion.innerText = version

// Global vars
let installedBrowsers = []
let currentTab = 'browsers-tab'

function switchTab(tabId) {
  switch (tabId) {
    case 'browsers-tab':
      about.classList.remove('is-active')
      aboutTab.classList.remove('is-active')
      browserList.classList.add('is-active')
      browsersTab.classList.add('is-active')
      populatePreferences()
      break

    case 'about-tab':
      about.classList.add('is-active')
      aboutTab.classList.add('is-active')
      browserList.classList.remove('is-active')
      browsersTab.classList.remove('is-active')
      currentWindow.setSize(400, 300 + 97)
      break

    default:
      break
  }
}

navItems.forEach(item =>
  item.addEventListener('click', function() {
    const tabId = item.id
    currentTab = tabId
    switchTab(tabId)
  })
)

/**
 * Toggle browser
 *
 * Sends the toggle-browser event to main.js. This enable/disables the browser.
 * @param {String} browserName
 * @param {Bool} enabled
 */
function toggleBrowser(browserName, enabled) {
  // update local copy of browsers
  installedBrowsers = installedBrowsers.map(browser => {
    if (browser.name === browserName) {
      return {
        ...browser,
        enabled
      }
    } else {
      return browser
    }
  })
  // update main.js copy of browsers
  electron.ipcRenderer.send('toggle-browser', { browserName, enabled })
}

/**
 * Sort browser
 *
 * Sends the sort-browser event to main.js. This allows browsers to be
 * reordered.
 * @param {Number} oldIndex index of browser being moved from.
 * @param {*} newIndex index of place browser is being moved to.
 */
function sortBrowser(oldIndex, newIndex) {
  electron.ipcRenderer.send('sort-browser', { oldIndex, newIndex })
}

/**
 * Incoming browsers event
 *
 * Listens for installed browsers from main.js, repopulating the window.
 */
electron.ipcRenderer.on('incomingBrowsers', (event, message) => {
  installedBrowsers = message
  if (currentTab === 'browsers-tab') {
    populatePreferences()
  }
})

/**
 * Populate preferences
 *
 * Injects all browsers as list items of preferences.
 */
function populatePreferences() {
  currentWindow.setSize(400, installedBrowsers.length * 64 + 97)

  var browserListFrag = document.createDocumentFragment()

  installedBrowsers
    .map(browser => {
      // use alias as label if available, otherwise use name
      if (!browser.alias) {
        browser.alias = browser.name
      }
      return browser
    })
    .map(browser => {
      const li = document.createElement('li')
      li.classList.add('browserItem')

      const handle = document.createElement('span')
      handle.classList.add('handle')
      li.appendChild(handle)

      const logo = document.createElement('img')
      logo.classList.add('browserLogo')
      logo.src = `images/browser-logos/${browser.name}.png`
      li.appendChild(logo)

      const name = document.createElement('span')
      name.classList.add('browserName')
      name.innerText = browser.alias
      li.appendChild(name)

      const checkboxWrapper = document.createElement('div')
      checkboxWrapper.classList.add('pretty')
      checkboxWrapper.classList.add('p-svg')

      const checkbox = document.createElement('input')
      checkbox.type = 'checkbox'
      checkboxWrapper.appendChild(checkbox)

      if (browser.enabled) {
        checkbox.checked = true
      }

      checkbox.addEventListener('change', e => {
        toggleBrowser(browser.name, e.target.checked)
      })

      const checkState = document.createElement('div')
      checkState.classList.add('state')
      checkState.classList.add('p-success')
      // check icon
      checkState.innerHTML = `
        <svg class="svg svg-icon" viewBox="0 0 20 20">
          <path d="M7.629,14.566c0.125,0.125,0.291,0.188,0.456,0.188c0.164,0,0.329-0.062,0.456-0.188l8.219-8.221c0.252-0.252,0.252-0.659,0-0.911c-0.252-0.252-0.659-0.252-0.911,0l-7.764,7.763L4.152,9.267c-0.252-0.251-0.66-0.251-0.911,0c-0.252,0.252-0.252,0.66,0,0.911L7.629,14.566z" style="stroke: white;fill:white;"></path>
        </svg>
        <label></label>`

      checkboxWrapper.appendChild(checkState)

      li.appendChild(checkboxWrapper)

      browserListFrag.appendChild(li)
    })

  browserList.innerHTML = ''
  browserList.appendChild(browserListFrag)

  Sortable.create(browserList, {
    draggable: '.browserItem',
    handle: '.handle',
    onEnd: e => sortBrowser(e.oldIndex, e.newIndex)
  })
}
