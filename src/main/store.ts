import { app } from 'electron'
import ElectronStore from 'electron-store'

import { Browser } from '../config/browsers'

/**
 * Keyboard shortcuts
 */
export type Hotkeys = { [key in string]: Browser['id'] }

export interface Store {
  fav: string
  firstRun: boolean
  hotkeys: Hotkeys
  lastUpdateCheck: number | undefined
  // TODO [>=11.0.0] Remove this when enough time has passed to flush-out old v10 settings
  urlHistory?: undefined
}

export const store = new ElectronStore<Store>({
  name: 'store',
  watch: true,
  // TODO [>=11.0.0] Remove this if not using migrations
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  projectVersion: app.getVersion(),
  defaults: {
    fav: 'com.apple.Safari',
    firstRun: true,
    hotkeys: {},
    lastUpdateCheck: undefined,
  },
  migrations: {
    // TODO [>=11.0.0] Remove this when enough time has passed to flush-out old v10 settings
    '>=10.3.0': (migrationStore) => {
      migrationStore.delete('urlHistory')
    },
  },
})
