import { ipcRenderer } from 'electron'

import { Browser } from '../config/browsers'
import { Hotkeys } from '../main/store'
import {
  BROWSER_SELECTED,
  COPY_TO_CLIPBOARD,
  FAVOURITE_UPDATED,
  HIDDEN_TILE_IDS_UPDATED,
  HIDE_WINDOW,
  HOTKEYS_UPDATED,
  LOGGER,
  QUIT,
  RELOAD,
  SET_AS_DEFAULT_BROWSER,
  UPDATE_RESTART,
} from './events'

export const selectBrowser = (
  url: string | undefined,
  browserId: Browser['id'] | undefined,
  isAlt: boolean,
): void => {
  ipcRenderer.send(BROWSER_SELECTED, { url, browserId, isAlt })
}

export const copyUrl = (url?: string): void => {
  if (url) {
    ipcRenderer.send(COPY_TO_CLIPBOARD, url)
  }
}

export const updateFav = (id: Browser['id']): void =>
  ipcRenderer.send(FAVOURITE_UPDATED, id)

export const updateHotkeys = (hotkeys: Hotkeys): void =>
  ipcRenderer.send(HOTKEYS_UPDATED, hotkeys)

export const hideWindow = (): void => ipcRenderer.send(HIDE_WINDOW)

export const mainLog = (string: string): void =>
  ipcRenderer.send(LOGGER, string)

export const updateRestart = (): void => ipcRenderer.send(UPDATE_RESTART)

export const quit = (): void => ipcRenderer.send(QUIT)

export const setAsDefaultBrowser = (): void =>
  ipcRenderer.send(SET_AS_DEFAULT_BROWSER)

export const reload = (): void => ipcRenderer.send(RELOAD)

export const updateHiddenTileIds = (tileIds: string[]): void =>
  ipcRenderer.send(HIDDEN_TILE_IDS_UPDATED, tileIds)
