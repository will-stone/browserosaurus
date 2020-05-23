import { atom } from 'recoil'

export const urlHistoryState = atom({
  key: 'urlState',
  default: [],
})

export const browsersState = atom({
  key: 'browsersState',
  default: [],
})
