import { ipcRenderer } from 'electron'

import { Browser } from '../config/browsers'
import {
  BROWSER_SELECTED,
  COPY_TO_CLIPBOARD,
  FAVOURITE_SELECTED,
} from './events'

export const selectBrowser = (
  urlId: string | undefined,
  browserId: Browser['id'],
  isAlt: boolean,
): void => ipcRenderer.send(BROWSER_SELECTED, { urlId, browserId, isAlt })

export const copyToClipboard = (string?: string): void => {
  if (string) {
    ipcRenderer.send(COPY_TO_CLIPBOARD, string)
  }
}

export const setFav = (id: Browser['id']): void =>
  ipcRenderer.send(FAVOURITE_SELECTED, id)
