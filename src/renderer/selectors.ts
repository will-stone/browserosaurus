import { selector } from 'recoil'
import Url from 'url'

import { UrlHistoryItem } from '../main/store'
import { urlHistoryState } from './atoms'

export const parsedLatestUrlState = selector({
  key: 'selectedUrlState',
  // TODO [+@types/recoil] this should be typed when recoil types are ready
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  get: ({ get }) => {
    const urlHistory: UrlHistoryItem[] = get(urlHistoryState)

    if (urlHistory[0]) {
      return Url.parse(urlHistory[0].url)
    }
  },
})
