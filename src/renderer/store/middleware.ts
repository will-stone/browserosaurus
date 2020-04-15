import electron from 'electron'
import { Middleware } from 'redux'

import { BROWSERS_GET } from '../../config/events'
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

  // keyboard
  else if (keyPress.match(action)) {
    const { browsers } = store.getState()
    browsers.forEach((b) => {
      console.log(b)
    })

    console.log({ key: action.payload.code, isAlt: action.payload.altKey })
  }

  // keyboard
  else if (browserClicked.match(action)) {
    console.log(action.payload)
  }

  return result
}

export default middleware
