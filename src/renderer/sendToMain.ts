import { ipcRenderer } from 'electron'

import { Browser } from '../config/browsers'
import { Hotkeys } from '../main/store'
import {
  BROWSER_SELECTED,
  COPY_TO_CLIPBOARD,
  ESCAPE_PRESSED,
  FAVOURITE_SELECTED,
  HOTKEYS_UPDATED,
  LOGGER,
  QUIT,
  RELOAD,
  SET_AS_DEFAULT_BROWSER,
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

export const selectFav = (id: Browser['id']): void =>
  ipcRenderer.send(FAVOURITE_SELECTED, id)

export const updateHotkeys = (hotkeys: Hotkeys): void =>
  ipcRenderer.send(HOTKEYS_UPDATED, hotkeys)

export const escapePressed = (): void => ipcRenderer.send(ESCAPE_PRESSED)

export const mainLog = (string: string): void =>
  ipcRenderer.send(LOGGER, string)

export const quit = (): void => ipcRenderer.send(QUIT)

export const setAsDefaultBrowser = (): void =>
  ipcRenderer.send(SET_AS_DEFAULT_BROWSER)

export const reload = (): void => ipcRenderer.send(RELOAD)
