import sortable from 'sortablejs'
import electron from 'electron'

import Window from '../shared/Window'

class PreferencesWindow extends Window {
  constructor() {
    super()
    this.browserTabWindowHeight = 0

    electron.ipcRenderer.on('updateAvailable', (event, updateUrl) => {
      const updateStatus = document.getElementById('updateStatus')
      if (updateUrl) {
        updateStatus.innerText = updateUrl
      } else {
        updateStatus.innerText = updateUrl
      }
    })

    /**
     * Incoming browsers event
     *
     * Listens for installed browsers from main.js, repopulating the window.
     */
    electron.ipcRenderer.on('incomingBrowsers', (event, browsers) => {
      this.populatePreferences(browsers)
    })

    this.attachNavClickEvents()
    this.populateVersion()
  }

  populateVersion() {
    const bVersion = document.getElementById('browserosaurusVersion')
    const localVersion = electron.remote.app.getVersion()
    bVersion.innerText = localVersion
  }

  attachNavClickEvents() {
    const navbar = document.getElementById('navbar')
    const navItems = navbar.querySelectorAll('li')
    navItems.forEach(tab =>
      tab.addEventListener('click', () => {
        this.switchTab(tab.id)
      })
    )
  }

  switchTab(tabId) {
    const browsersTab = document.getElementById('browsers-tab')
    const aboutTab = document.getElementById('about-tab')
    const about = document.getElementById('about')
    switch (tabId) {
      case 'browsers-tab':
        about.classList.remove('is-active')
        aboutTab.classList.remove('is-active')
        this.browserList.classList.add('is-active')
        browsersTab.classList.add('is-active')
        this.window.setSize(400, this.browserTabWindowHeight)
        break

      case 'about-tab':
        about.classList.add('is-active')
        aboutTab.classList.add('is-active')
        this.browserList.classList.remove('is-active')
        browsersTab.classList.remove('is-active')
        this.window.setSize(400, 300 + 97)
        electron.ipcRenderer.send('check-for-update')
        break

      default:
        break
    }
  }

  /**
   * Toggle browser
   *
   * Sends the toggle-browser event to main.js. This enable/disables the browser.
   * @param {String} browserName
   * @param {Bool} enabled
   */
  toggleBrowser(browserName, enabled) {
    electron.ipcRenderer.send('toggle-browser', { browserName, enabled })
  }

  /**
   * Sort browser
   *
   * Sends the sort-browser event to main.js. This allows browsers to be
   * reordered.
   * @param {Number} oldIndex index of browser being moved from.
   * @param {Number} newIndex index of place browser is being moved to.
   */
  sortBrowser(oldIndex, newIndex) {
    electron.ipcRenderer.send('sort-browser', { oldIndex, newIndex })
  }

  /**
   * Populate preferences
   *
   * Injects all browsers as list items of preferences.
   */
  populatePreferences(browsers) {
    this.browserTabWindowHeight = browsers.length * 64 + 97
    this.window.setSize(400, this.browserTabWindowHeight)

    var browserListFrag = document.createDocumentFragment()

    browsers
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
        logo.src = `../images/browser-logos/${browser.name}.png`
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
          this.toggleBrowser(browser.name, e.target.checked)
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

    this.browserList.innerHTML = ''
    this.browserList.appendChild(browserListFrag)

    sortable.create(this.browserList, {
      draggable: '.browserItem',
      handle: '.handle',
      onEnd: e => this.sortBrowser(e.oldIndex, e.newIndex)
    })
  }
}

new PreferencesWindow()
