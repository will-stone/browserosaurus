import type { AnyAction } from '@reduxjs/toolkit'
import electron, { app } from 'electron'

import { appReady } from '../shared/state/actions'
import { Channel } from '../shared/state/channels'
import { dispatch } from './state/store'
import { urlOpener } from './state/thunk.url-opener'
import { storage } from './storage'

// Attempt to fix this bug: https://github.com/electron/electron/issues/20944
app.commandLine.appendArgument('--enable-features=Metal')

if (storage.get('firstRun')) {
  // Prompt to set as default browser
  app.setAsDefaultProtocolClient('http')
  app.setAsDefaultProtocolClient('https')
}

storage.set('firstRun', false)

app.on('ready', () => dispatch(appReady()))

// App doesn't always close on ctrl-c in console, this fixes that
app.on('before-quit', () => app.exit())

app.on('open-url', (event, url) => {
  event.preventDefault()
  // FIX casting when I know how to correctly type this dispatch to allow thunks
  dispatch(urlOpener(url) as unknown as AnyAction)
})

/**
 * Enter actions from renderer into main's store's queue
 */
electron.ipcMain.on(Channel.PREFS, (_, action: AnyAction) => dispatch(action))
electron.ipcMain.on(Channel.TILES, (_, action: AnyAction) => dispatch(action))
