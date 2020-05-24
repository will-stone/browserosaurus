import { selector } from 'recoil'

import {
  selectLastestUrlHistoryItem,
  UrlHistoryItem,
  UrlHistoryStore,
} from '../main/stores'
import { urlHistoryAtom, urlIdAtom } from './atoms'

export const urlIdSelector = selector({
  key: 'urlIdSelector',
  // TODO [+@types/recoil] this should be typed when recoil types are ready
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  get: ({ get }): string | undefined => {
    const selectedId: string | undefined = get(urlIdAtom)
    const urlHistory: UrlHistoryStore = get(urlHistoryAtom)

    // If no ID selected, use the latest from history, else undefined
    if (!selectedId) {
      const lastestUrlHistoryItem = selectLastestUrlHistoryItem(urlHistory)
      return lastestUrlHistoryItem?.id
    }

    // If id exists, return it, else undefined
    return urlHistory[selectedId]?.id
  },
  // TODO [+@types/recoil] this should be typed when recoil types are ready
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  set: ({ set }, value) => set(urlIdAtom, value),
})

export const urlItemSelector = selector({
  key: 'urlItemSelector',
  // TODO [+@types/recoil] this should be typed when recoil types are ready
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  get: ({ get }): UrlHistoryItem | undefined => {
    const urlId: string | undefined = get(urlIdSelector)
    const urlHistory: UrlHistoryStore = get(urlHistoryAtom)

    if (urlId) {
      return urlHistory[urlId]
    }
  },
})
