import ElectronStore from 'electron-store'

import { Browser } from '../config/browsers'

/**
 * A stored URL item
 */
export interface UrlHistoryItem {
  id: string
  url: string
  timestamp: number
}

/**
 * Keyboard shortcuts
 */
export type Hotkeys = { [key in string]: Browser['id'] }

export interface Store {
  fav: string
  firstRun: boolean
  urlHistory: UrlHistoryItem[]
  hotkeys: Hotkeys
  lastUpdateCheck: number | undefined
}

export const store = new ElectronStore<Store>({
  name: 'store',
  watch: true,
  defaults: {
    fav: 'com.apple.Safari',
    firstRun: true,
    urlHistory: [],
    hotkeys: {},
    lastUpdateCheck: undefined,
  },
})
