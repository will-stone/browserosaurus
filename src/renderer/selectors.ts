import { selector } from 'recoil'
import Url from 'url'

import { selectLastestUrlHistoryItem, UrlHistoryStore } from '../main/stores'
import { selectedUrlIdState, urlHistoryState } from './atoms'

export const parsedSelectedUrlState = selector({
  key: 'parsedSelectedUrlState',
  // TODO [+@types/recoil] this should be typed when recoil types are ready
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  get: ({ get }): Url.UrlWithStringQuery | undefined => {
    const urlHistory: UrlHistoryStore = get(urlHistoryState)
    const selectedUrlId: string = get(selectedUrlIdState)
    const selectedUrlHistoryItem = urlHistory[selectedUrlId]

    if (selectedUrlHistoryItem) {
      return Url.parse(selectedUrlHistoryItem.url)
    }

    const latestItem = selectLastestUrlHistoryItem(urlHistory)

    if (latestItem) {
      return Url.parse(latestItem.url)
    }
  },
})
