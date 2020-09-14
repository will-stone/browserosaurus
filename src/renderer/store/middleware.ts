/* eslint-disable node/callback-return -- allows using next at top of middleware */

import { Middleware } from 'redux'

import {
  catchMouse,
  changeTheme,
  copyUrl,
  hideWindow,
  quit,
  releaseMouse,
  reload,
  selectApp,
  selectFav,
  setAsDefaultBrowser,
  startRenderer,
  updateHiddenTileIds,
  updateHotkeys,
  updateRestart,
} from '../sendToMain'
import { RootState } from '.'
import {
  appStarted,
  clickedCopyButton,
  clickedQuitButton,
  clickedReloadButton,
  clickedSetAsDefaultButton,
  clickedThemeButton,
  clickedTileButton,
  clickedUpdateButton,
  foundMouse,
  lostMouse,
  madeTileFav,
  pressedAppKey,
  pressedCopyKey,
  pressedEscapeKey,
  toggledTileVisibility,
  updatedTileHotkey,
} from './actions'

export const middleware: Middleware<unknown, RootState> = (store) => (next) => (
  action,
) => {
  if (appStarted.match(action)) {
    startRenderer()
  }

  //
  else if (lostMouse.match(action)) {
    releaseMouse()
  }

  //
  else if (foundMouse.match(action)) {
    catchMouse()
  }

  // Hide window if escape key is pressed when no menus are open
  else if (pressedEscapeKey.match(action)) {
    if (!store.getState().ui.menu) {
      hideWindow()
    }
  }

  //
  else if (pressedCopyKey.match(action) || clickedCopyButton.match(action)) {
    const { url } = store.getState().ui
    if (url) {
      copyUrl(url)
      hideWindow()
    }
  }

  //
  else if (pressedAppKey.match(action)) {
    const { url } = store.getState().ui
    const { isAlt } = action.payload

    // Favourite
    if (action.payload.key === 'Space' || action.payload.key === 'Enter') {
      const { fav } = store.getState().mainStore
      selectApp({ url, appId: fav, isAlt })
      hideWindow()
    }
    // Hotkey
    else {
      const { hotkeys } = store.getState().mainStore
      const appId = hotkeys[action.payload.key]
      if (appId) {
        selectApp({ url, appId, isAlt })
        hideWindow()
      }
    }
  }

  //
  else if (clickedTileButton.match(action)) {
    const { url } = store.getState().ui
    const { appId, isAlt } = action.payload
    selectApp({ url, appId, isAlt })
    hideWindow()
  }

  //
  else if (clickedReloadButton.match(action)) {
    reload()
  }

  //
  else if (clickedQuitButton.match(action)) {
    quit()
  }

  //
  else if (clickedSetAsDefaultButton.match(action)) {
    setAsDefaultBrowser()
  }

  //
  else if (clickedUpdateButton.match(action)) {
    updateRestart()
  }

  //
  else if (clickedThemeButton.match(action)) {
    changeTheme(action.payload)
  }

  // Everything above here is run BEFORE reducers are calculated for the current action
  const result = next(action)
  // Everything below here is run AFTER reducers are calculated for the current action

  if (madeTileFav.match(action) && action.payload) {
    selectFav(action.payload)
  }

  //
  else if (toggledTileVisibility.match(action)) {
    updateHiddenTileIds(store.getState().mainStore.hiddenTileIds)
  }

  //
  else if (updatedTileHotkey.match(action)) {
    updateHotkeys(store.getState().mainStore.hotkeys)
  }

  return result
}
