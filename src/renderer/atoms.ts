import { atom } from 'recoil'

export const isUrlHistoryOpenAtom = atom({
  key: 'isUrlHistoryOpenAtom',
  default: false,
})

export const urlIdAtom = atom({
  key: 'urlIdAtom',
  default: undefined,
})

export const urlHistoryAtom = atom({
  key: 'urlHistoryAtom',
  default: [],
})

export const browsersAtom = atom({
  key: 'browsersAtom',
  default: [],
})
