import { atom } from 'recoil'

export const urlIdAtom = atom({
  key: 'selectedUrlIdState',
  default: undefined,
})

export const urlHistoryAtom = atom({
  key: 'urlHistoryState',
  default: [],
})

export const browsersAtom = atom({
  key: 'browsersState',
  default: [],
})
