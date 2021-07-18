import type { Rectangle } from 'electron'
import ElectronStore from 'electron-store'

import type { App } from '../../shared/state/reducer.apps'

/**
 * Keyboard shortcuts
 */
export type Hotkeys = { [key in string]: App['id'] }

export interface PermaStore {
  supportMessage: number
  fav: string
  firstRun?: boolean
  hotkeys: Hotkeys
  hiddenTileIds: string[]
  bounds?: Rectangle
}

// TODO cannot upgrade from electron-store v6 to v8 until it's compatible with
// npm 7: https://github.com/sindresorhus/electron-store/issues/185
export const permaStore = new ElectronStore<PermaStore>({
  name: 'store',
  defaults: {
    supportMessage: 0,
    fav: 'com.apple.Safari',
    firstRun: true,
    hotkeys: {},
    hiddenTileIds: [],
  },
})
