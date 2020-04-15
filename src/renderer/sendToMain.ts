import { ipcRenderer } from 'electron'

import { Browser } from '../config/browsers'
import { BROWSER_RUN, FAV_SET } from '../config/events'

export const runBrowser = (id: Browser['id'], isAlt: boolean) =>
  ipcRenderer.send(BROWSER_RUN, { id, isAlt })

export const setFav = (id: Browser['id']) => ipcRenderer.send(FAV_SET, id)
