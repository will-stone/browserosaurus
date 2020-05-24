import Store from 'electron-store'

/**
 * -----------------
 * URL HISTORY STORE
 * -----------------
 */

/**
 * A stored URL item
 */
export interface UrlHistoryItem {
  id: string
  url: string
  timestamp: number
}

export interface UrlHistoryStore {
  [key: string]: UrlHistoryItem
}

export const urlHistoryStore = new Store<UrlHistoryStore>({
  name: 'url-history',
  watch: true,
  defaults: {},
})

export function selectUrlHistoryItemsByTimestamp(
  store: UrlHistoryStore,
): UrlHistoryItem[] {
  const items = Object.values(store)
  const itemsByTimestamp = items.sort((a, b) => b.timestamp - a.timestamp)
  return itemsByTimestamp
}

export function selectLastestUrlHistoryItem(
  store: UrlHistoryStore,
): UrlHistoryItem | undefined {
  return selectUrlHistoryItemsByTimestamp(store)[0]
}

/**
 * ------------
 * CONFIG STORE
 * ------------
 */

export interface ConfigStore {
  fav: string
}

export const configStore = new Store<ConfigStore>({
  name: 'general-config',
  defaults: {
    fav: 'com.apple.Safari',
  },
})
