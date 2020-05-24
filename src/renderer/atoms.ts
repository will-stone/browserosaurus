import { atom } from 'recoil'

export const selectedUrlIdState = atom({
  key: 'selectedUrlIdState',
  default: undefined,
})

export const urlHistoryState = atom({
  key: 'urlHistoryState',
  default: {},
})

export const browsersState = atom({
  key: 'browsersState',
  default: [],
})
