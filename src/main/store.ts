import ElectronStore from 'electron-store'

import { App } from '../config/apps'

/**
 * Keyboard shortcuts
 */
export type Hotkeys = { [key in string]: App['id'] }

export interface Store {
  fav: string
  firstRun?: boolean
  hotkeys: Hotkeys
  hiddenTileIds: string[]
  // TODO [>=11.0.0] Remove this when enough time has passed to flush-out old v10 settings
  lastUpdateCheck?: unknown
  // TODO [>=11.0.0] Remove this when enough time has passed to flush-out old v10 settings
  urlHistory?: unknown
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

// TODO [>=11.0.0] Remove this when enough time has passed to flush-out old v10 settings
// Remove old settings (cannot get electron-store's migrations to work)
store.delete('urlHistory')
store.delete('lastUpdateCheck')
