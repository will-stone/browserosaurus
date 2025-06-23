import type { UnknownAction } from '@reduxjs/toolkit'
import electron, { app, globalShortcut } from 'electron'
import { sleep } from 'tings'

import { Channel } from '../shared/state/channels.js'
import { openedUrl, readiedApp } from './state/actions.js'
import { dispatch, getState } from './state/store.js'

app.on('ready', () => dispatch(readiedApp()))

// App doesn't always close on ctrl-c in console, this fixes that
app.on('before-quit', () => app.exit())

// Clean up global shortcuts on quit
app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})

app.on('open-url', (event, url) => {
  event.preventDefault()

  const urlOpener = async () => {
    if (getState().data.pickerStarted) {
      dispatch(openedUrl(url))
    }
    // If B was opened by sending it a URL, the `open-url` electron.app event
    // can be fired before the picker window is ready. Here we wait before trying again.
    else {
      await sleep(500)
      urlOpener()
    }
  }

  urlOpener()
})

/**
 * Enter actions from renderer into main's store's queue
 */
electron.ipcMain.on(Channel.PREFS, (_, action: UnknownAction) =>
  dispatch(action),
)
electron.ipcMain.on(Channel.PICKER, (_, action: UnknownAction) =>
  dispatch(action),
)
