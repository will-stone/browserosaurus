import { ipcRenderer } from 'electron'

import { Browser } from '../config/browsers'
import { Hotkeys } from '../main/store'

export const SELECT_BROWSER = 'SELECT_BROWSER'
export const selectBrowser = (
  url: string | undefined,
  browserId: Browser['id'] | undefined,
  isAlt: boolean,
): void => {
  ipcRenderer.send(SELECT_BROWSER, { url, browserId, isAlt })
}

export const COPY_TO_CLIPBOARD = 'COPY_TO_CLIPBOARD'
export const copyUrl = (url?: string): void => {
  if (url) {
    ipcRenderer.send(COPY_TO_CLIPBOARD, url)
  }
}

export const UPDATE_FAV = 'UPDATE_FAV'
export const updateFav = (id: Browser['id']): void =>
  ipcRenderer.send(UPDATE_FAV, id)

export const UPDATE_HOTKEYS = 'UPDATE_HOTKEYS'
export const updateHotkeys = (hotkeys: Hotkeys): void =>
  ipcRenderer.send(UPDATE_HOTKEYS, hotkeys)

export const HIDE_WINDOW = 'HIDE_WINDOW'
export const hideWindow = (): void => ipcRenderer.send(HIDE_WINDOW)

export const MAIN_LOG = 'MAIN_LOG'
export const mainLog = (string: string): void =>
  ipcRenderer.send(MAIN_LOG, string)

export const UPDATE_RESTART = 'UPDATE_RESTART'
export const updateRestart = (): void => ipcRenderer.send(UPDATE_RESTART)

export const QUIT = 'QUIT'
export const quit = (): void => ipcRenderer.send(QUIT)

export const SET_AS_DEFAULT_BROWSER = 'SET_AS_DEFAULT_BROWSER'
export const setAsDefaultBrowser = (): void =>
  ipcRenderer.send(SET_AS_DEFAULT_BROWSER)

export const RELOAD = 'RELOAD'
export const reload = (): void => ipcRenderer.send(RELOAD)

export const UPDATE_HIDDEN_TILE_IDS = 'UPDATE_HIDDEN_TILE_IDS'
export const updateHiddenTileIds = (tileIds: string[]): void =>
  ipcRenderer.send(UPDATE_HIDDEN_TILE_IDS, tileIds)

export const START_APP = 'START_APP'
export const startApp = (): void => ipcRenderer.send(START_APP)
