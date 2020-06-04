import last from 'lodash/fp/last'
import { selector } from 'recoil'

import { UrlHistoryItem } from '../main/store'
import {
  areHotKeysEnabledAtom,
  MenuState,
  openMenuAtom,
  urlHistoryAtom,
  urlIdAtom,
} from './atoms'

/**
 * Current URL
 */
export const urlIdSelector = selector<string | undefined>({
  key: 'urlIdSelector',
  get: ({ get }) => {
    const selectedId = get(urlIdAtom)
    const urlHistory = get(urlHistoryAtom)

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
  get: ({ get }) => {
    const urlId = get(urlIdSelector)
    const urlHistory: UrlHistoryItem[] = get(urlHistoryAtom)

    if (urlId) {
      return urlHistory.find((u) => u.id === urlId)
    }
  },
})

/**
 * Certain menus cause side effects when set
 */
export const openMenuSelector = selector<MenuState>({
  key: 'openMenuSelector',
  get: ({ get }) => {
    return get(openMenuAtom)
  },
  set: ({ set }, menu) => {
    if (menu === 'hotkeys') {
      set(areHotKeysEnabledAtom, false)
      set(openMenuAtom, 'hotkeys')
    } else {
      set(areHotKeysEnabledAtom, true)
      set(openMenuAtom, menu)
    }
  },
})
