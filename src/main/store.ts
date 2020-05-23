import Store from 'electron-store'
import last from 'lodash/fp/last'

import { URL_HISTORY_CHANGED } from './events'
import { bWindow } from './main'

export interface UrlHistoryItem {
  url: string
  timestamp: number
}

export interface TheStore {
  fav: string
  urlHistory: UrlHistoryItem[]
}

/**
 * Configured store
 */
export const store = new Store<TheStore>({
  watch: true,
  defaults: {
    fav: 'com.apple.Safari',
    urlHistory: [],
  },
})

/**
 * Latest URL selector
 */
export const selectLastestUrl = (): UrlHistoryItem | undefined => {
  return last(store.get('urlHistory'))
}

/**
 * URL History on change listener
 */
store.onDidChange('urlHistory', () => {
  const urlHistory = store.get('urlHistory')
  bWindow?.webContents.send(URL_HISTORY_CHANGED, urlHistory)
  bWindow?.show()
})
