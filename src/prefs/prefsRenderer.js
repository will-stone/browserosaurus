import electron, { remote, shell } from 'electron'
import h from 'hyperscript'
import sortable from 'sortablejs'

import Window from '../shared/Window'

import html2element from '../utils/html2element'

class PrefsWindow extends Window {
  constructor() {
    super()
    this.activeTabIndex = 0

    /**
     * Event: Update Available
     *
     * After update checked in main, it is then sent here where About tab is
     * updated.
     * @param {object} update - {update: boolean, message: string}
     */
    electron.ipcRenderer.on('updateAvailable', this.onUpdateAvaialble)

    // Setup
    this.attachNavClickEvents()
    this.populateVersion()
  }

  /**
   * On Update Available
   *
   * Function called when update available event is fired. Populates the update
   * status element in About tab.
   * @param {object} event - unused
   * @param {object} param1 - {update: boolean, message: string} if true,
   * message is update URL.
   */
  onUpdateAvaialble(event, { update, message }) {
    const updateStatus = document.getElementById('updateStatus')
    if (update) {
      const button = document.createElement('button')
      button.classList.add('button')
      button.addEventListener('click', () => shell.openExternal(message))
      button.innerText = 'Update available!'
      updateStatus.innerHTML = ''
      updateStatus.appendChild(button)
    } else {
      updateStatus.innerText = message
    }
  }

  /**
   * Populate Version
   *
   * Get the version of this app and place it in the About tab
   */
  populateVersion() {
    const bVersion = document.getElementById('browserosaurusVersion')
    const localVersion = remote.app.getVersion()
    bVersion.innerText = localVersion
  }

  /**
   * Attach Nav Click Events
   *
   * Make tab buttons clickable.
   */
  attachNavClickEvents() {
    const tabButtons = document.getElementsByClassName('tab-button')
    Array.from(tabButtons).forEach((tabButton, index) => {
      tabButton.addEventListener('click', () => this.switchTab(index))
    })
  }

  /**
   * Switch Tab
   *
   * Move to selected tab.
   * @param {string} tabId
   */
  switchTab(tabIndex) {
    this.activeTabIndex = tabIndex
    const tabButtons = Array.from(document.getElementsByClassName('tab-button'))
    const tabs = Array.from(document.getElementsByClassName('tab'))

    tabButtons.forEach((tabButton, index) => {
      if (index === this.activeTabIndex) {
        tabButton.classList.add('is-active')
        tabs[index].classList.add('is-active')
      } else {
        tabButton.classList.remove('is-active')
        tabs[index].classList.remove('is-active')
      }

      if (this.activeTabIndex === 0) {
        // Browsers
      } else if (this.activeTabIndex === 1) {
        // About
        electron.ipcRenderer.send('check-for-update')
      }
    })
    this.updateWindowHeight()
  }

  /**
   * Toggle browser
   *
   * Sends the toggle-browser event to main.js. This enable/disables the
   * browser.
   * @param {string} browserName
   * @param {boolean} enabled
   */
  toggleBrowser(browserName, enabled) {
    electron.ipcRenderer.send('toggle-browser', { browserName, enabled })
  }

  /**
   * Sort Browser
   *
   * Sends the sort-browser event to main.js. This allows browsers to be
   * reordered.
   * @param {number} oldIndex index of browser being moved from.
   * @param {number} newIndex index of place browser is being moved to.
   */
  sortBrowser(oldIndex, newIndex) {
    electron.ipcRenderer.send('sort-browser', { oldIndex, newIndex })
  }

  /**
   * On Receive Browsers (see Window class)
   *
   * Injects all browsers as list items in browsers tab.
   * @param {array} browsers - array of objects
   */
  onReceiveBrowsers(browsers) {
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
        const browserRow = h(
          'tr.browser-row',
          h(
            'td.browser-cell',
            h('span.handle'),
            h('img.browserLogo', {
              src: `../images/browser-logos/${browser.name}.png`
            }),
            h('span.browserName', browser.alias)
          ),
          h(
            'td',
            h(
              'div.pretty.p-svg',
              h('input', {
                type: 'checkbox',
                checked: browser.enabled,
                onchange: e => {
                  this.toggleBrowser(browser.name, e.target.checked)
                }
              }),
              h(
                'div.state.p-success',
                html2element(`<svg class="svg svg-icon" viewBox="0 0 20 20">
                  <path d="M7.629,14.566c0.125,0.125,0.291,0.188,0.456,0.188c0.164,0,0.329-0.062,0.456-0.188l8.219-8.221c0.252-0.252,0.252-0.659,0-0.911c-0.252-0.252-0.659-0.252-0.911,0l-7.764,7.763L4.152,9.267c-0.252-0.251-0.66-0.251-0.911,0c-0.252,0.252-0.252,0.66,0,0.911L7.629,14.566z" style="stroke: white;fill:white;"></path>
                </svg>`),
                h('label')
              )
            )
          )
        )

        browserListFrag.appendChild(browserRow)
      })

    this.browserList.innerHTML = ''
    this.browserList.appendChild(browserListFrag)

    this.updateWindowHeight()

    sortable.create(this.browserList, {
      draggable: '.browser-row',
      handle: '.handle',
      onEnd: e => this.sortBrowser(e.oldIndex, e.newIndex)
    })
  }
}

new PrefsWindow()
