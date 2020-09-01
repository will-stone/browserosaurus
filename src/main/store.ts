import ElectronStore from 'electron-store'

import { App } from '../config/types'

/**
 * Keyboard shortcuts
 */
export type Hotkeys = { [key in string]: App['id'] }

export interface Store {
  fav: string
  firstRun?: boolean
  hotkeys: Hotkeys
  hiddenTileIds: string[]
}

export const store = new ElectronStore<Store>({
  name: 'store',
  defaults: {
    fav: 'com.apple.Safari',
    firstRun: true,
    hotkeys: {},
    hiddenTileIds: [],
  },
})
