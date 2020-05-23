import last from 'lodash/fp/last'
import { selector } from 'recoil'
import Url from 'url'

import { UrlHistoryItem } from '../../main/store'
import { urlHistoryState } from './atoms'

export const parsedLatestUrlState = selector({
  key: 'selectedUrlState',
  // TODO [+@types/recoil] this should be typed when recoil types are ready
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  get: ({ get }) => {
    const urlHistory: UrlHistoryItem[] = get(urlHistoryState)
    const latestItem = last(urlHistory)

    if (latestItem) {
      return Url.parse(latestItem.url)
    }
  },
})
