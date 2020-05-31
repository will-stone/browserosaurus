import { atom } from 'recoil'

import { Browser } from '../config/browsers'
import { UrlHistoryItem } from '../main/store'

export const isUrlHistoryOpenAtom = atom({
  key: 'isUrlHistoryOpenAtom',
  default: false,
})

export const urlIdAtom = atom<string | undefined>({
  key: 'urlIdAtom',
  default: undefined,
})

export const urlHistoryAtom = atom<UrlHistoryItem[]>({
  key: 'urlHistoryAtom',
  default: [],
})

export const browsersAtom = atom<Browser[]>({
  key: 'browsersAtom',
  default: [],
})

export const versionAtom = atom<string | undefined>({
  key: 'versionAtom',
  default: undefined,
})

export const favBrowserIdAtom = atom<string>({
  key: 'favBrowserIdAtom',
  default: '',
})
