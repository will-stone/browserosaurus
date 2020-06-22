import { atom } from 'recoil'

import { Browser } from '../config/browsers'

/**
 * -----------------------------------------------------------------------------
 * TYPES
 * -----------------------------------------------------------------------------
 */

export type MenuState = 'sponsor' | 'tiles' | false

/**
 * -----------------------------------------------------------------------------
 * ATOMS
 * -----------------------------------------------------------------------------
 */

export const isUpdateAvailableAtom = atom<boolean>({
  key: 'isUpdateAvailableAtom',
  default: false,
})

export const browsersAtom = atom<Browser[]>({
  key: 'browsersAtom',
  default: [],
})

export const versionAtom = atom<string>({
  key: 'versionAtom',
  default: '',
})

export const isDefaultBrowserAtom = atom<boolean>({
  key: 'isDefaultBrowserAtom',
  default: true,
})
