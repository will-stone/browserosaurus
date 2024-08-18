import type { UnknownAction } from '@reduxjs/toolkit'
import electron, { app } from 'electron'
import { TidyURL } from 'tidy-url'
import { sleep } from 'tings'

import { Channel } from '../shared/state/channels'
import { openedUrl, readiedApp } from './state/actions'
import { dispatch, getState } from './state/store'

app.on('ready', () => dispatch(readiedApp()))

// App doesn't always close on ctrl-c in console, this fixes that
app.on('before-quit', () => app.exit())

app.on('open-url', (event, url) => {
  event.preventDefault()

  const tidyUrl = TidyURL.clean(url)

  const urlOpener = async () => {
    if (getState().data.pickerStarted) {
      dispatch(openedUrl(tidyUrl.url))
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
