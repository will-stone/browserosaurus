import type { AnyAction } from '@reduxjs/toolkit'
import electron, { app } from 'electron'
import sleep from 'tings/lib/sleep'

import { Channel } from '../shared/state/channels'
import { openedUrl, readiedApp } from './state/actions'
import { dispatch, getState } from './state/store'

// Attempt to fix this bug: https://github.com/electron/electron/issues/20944
app.commandLine.appendArgument('--enable-features=Metal')

app.on('ready', () => dispatch(readiedApp()))

// App doesn't always close on ctrl-c in console, this fixes that
app.on('before-quit', () => app.exit())

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
electron.ipcMain.on(Channel.PREFS, (_, action: AnyAction) => dispatch(action))
electron.ipcMain.on(Channel.PICKER, (_, action: AnyAction) => dispatch(action))
