import type { Rectangle } from 'electron'
import ElectronStore from 'electron-store'

import type { App } from '../shared/state/reducer.apps'

/**
 * Keyboard shortcuts
 */
export type Hotkeys = { [key in string]: App['id'] }

export interface Storage {
  supportMessage: number
  fav: string
  firstRun?: boolean
  hotkeys: Hotkeys
  hiddenTileIds: string[]
  bounds?: Rectangle
}

// TODO cannot upgrade from electron-store v6 to v8 until it's compatible with
// npm 7: https://github.com/sindresorhus/electron-store/issues/185
const electronStore = new ElectronStore<Storage>({
  name: 'store',
  defaults: {
    supportMessage: 0,
    fav: 'com.apple.Safari',
    firstRun: true,
    hotkeys: {},
    hiddenTileIds: [],
  },
})

export const storage = {
  get: <Key extends keyof Storage>(key: Key): Storage[Key] =>
    electronStore.get(key),

  set: <Key extends keyof Storage>(key: Key, value: Storage[Key]): void =>
    electronStore.set(key, value),

  getAll: (): Storage => electronStore.store,

  setAll: (value: Storage): void => electronStore.set(value),
}
