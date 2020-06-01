import last from 'lodash/fp/last'
import { selector } from 'recoil'

import { UrlHistoryItem } from '../main/store'
import { openMenuAtom, urlHistoryAtom, urlIdAtom } from './atoms'

/**
 * Current URL
 */
export const urlIdSelector = selector<string | undefined>({
  key: 'urlIdSelector',
  get: ({ get }): string | undefined => {
    const selectedId: string | undefined = get(urlIdAtom)
    const urlHistory: UrlHistoryItem[] = get(urlHistoryAtom)

    // If no ID selected, use the latest from history, else undefined
    if (!selectedId) {
      const lastestUrlHistoryItem = last(urlHistory)
      return lastestUrlHistoryItem?.id
    }

    // If id exists, return it, else undefined
    return urlHistory.find((u) => u.id === selectedId)?.id
  },
  set: ({ set }, urlId) => {
    set(openMenuAtom, false)
    set(urlIdAtom, urlId)
  },
})

/**
 * Current URL item
 */
export const urlItemSelector = selector({
  key: 'urlItemSelector',
  get: ({ get }): UrlHistoryItem | undefined => {
    const urlId = get(urlIdSelector)
    const urlHistory: UrlHistoryItem[] = get(urlHistoryAtom)

    if (urlId) {
      return urlHistory.find((u) => u.id === urlId)
    }
  },
})
