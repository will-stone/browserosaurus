import { atom, selector } from 'recoil'

import { Browser } from '../config/browsers'
import { Hotkeys } from '../main/store'

/**
 * -----------------------------------------------------------------------------
 * TYPES
 * -----------------------------------------------------------------------------
 */

export type MenuState = 'fav' | 'hotkeys' | false

/**
 * -----------------------------------------------------------------------------
 * ATOMS
 * -----------------------------------------------------------------------------
 */

const urlAtom = atom<string | undefined>({
  key: 'urlAtom',
  default: undefined,
})

const openMenuAtom = atom<MenuState>({
  key: 'openMenuAtom',
  default: false,
})

export const updateAvailableAtom = atom({
  key: 'updateAvailableAtom',
  default: false,
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

export const isDefaultBrowserAtom = atom<boolean>({
  key: 'isDefaultBrowserAtom',
  default: true,
})

export const areHotKeysEnabledAtom = atom<boolean>({
  key: 'areHotKeysEnabledAtom',
  default: true,
})

export const hotkeysAtom = atom<Hotkeys>({
  key: 'hotkeysAtom',
  default: {},
})

/**
 * -----------------------------------------------------------------------------
 * SELECTORS
 * -----------------------------------------------------------------------------
 */

/**
 * Certain menus cause side effects when set
 */
export const openMenuSelector = selector<MenuState>({
  key: 'openMenuSelector',
  get: ({ get }) => {
    return get(openMenuAtom)
  },
  set: ({ set }, menu) => {
    if (menu === 'hotkeys') {
      set(areHotKeysEnabledAtom, false)
      set(openMenuAtom, 'hotkeys')
    } else {
      set(areHotKeysEnabledAtom, true)
      set(openMenuAtom, menu)
    }
  },
})

/**
 * Current URL
 */
export const urlSelector = selector<string | undefined>({
  key: 'urlIdSelector',
  get: ({ get }) => {
    return get(urlAtom)
  },
  set: ({ set }, url) => {
    set(openMenuSelector, false)
    set(urlAtom, url)
  },
})
