import ElectronStore from 'electron-store'

/**
 * A stored URL item
 */
export interface UrlHistoryItem {
  id: string
  url: string
  timestamp: number
}

export interface Store {
  fav: string
  firstRun: boolean
  urlHistory: UrlHistoryItem[]
}

export const store = new ElectronStore<Store>({
  name: 'store',
  watch: true,
  defaults: {
    fav: 'com.apple.Safari',
    firstRun: true,
    urlHistory: [],
  },
})
