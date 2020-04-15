import electron from 'electron'
import { Middleware } from 'redux'

import { BROWSERS_GET } from '../../config/events'
import { runBrowser } from '../sendToMain'
import { RootState } from '.'
import { appLoaded, browserClicked, keyPress } from './actions'

const middleware = (): Middleware<{}, RootState> => (store) => (next) => (
  action,
) => {
  // We want the middleware to asynchronously proceed to the next so calling
  // the callback without returning is okay.
  // eslint-disable-next-line callback-return
  const result = next(action)

  // appLoaded
  if (appLoaded.match(action)) {
    electron.ipcRenderer.send(BROWSERS_GET)
  }

  // keyPress
  else if (keyPress.match(action)) {
    // Launch browser if alpha key is a hotkey
    const keyMatch = action.payload.code.match(/^Key([A-Z])$/u)
    if (keyMatch) {
      const val = keyMatch[1].toLowerCase()
      const { browsers } = store.getState()
      const browser = browsers.find((b) => b.hotKey === val)
      if (browser) {
        runBrowser(browser.id, action.payload.altKey)
      }
    }
  }

  // browserClicked
  else if (browserClicked.match(action)) {
    const { id, isAlt } = action.payload
    runBrowser(id, isAlt)
  }

  return result
}

export default middleware
