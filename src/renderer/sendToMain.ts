import { ipcRenderer } from 'electron'

import { Browser } from '../config/browsers'
import { BROWSER_SELECTED, FAVOURITE_SELECTED } from './events'

export const selectBrowser = (id: Browser['id'], isAlt: boolean): void =>
  ipcRenderer.send(BROWSER_SELECTED, { id, isAlt })

export const setFav = (id: Browser['id']): void =>
  ipcRenderer.send(FAVOURITE_SELECTED, id)
