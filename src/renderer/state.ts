import { atom, selector } from 'recoil'

import { Browser } from '../config/browsers'
import { Hotkeys } from '../main/store'

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

const urlAtom = atom<string | undefined>({
  key: 'urlAtom',
  default: undefined,
})

const openMenuAtom = atom<MenuState>({
  key: 'openMenuAtom',
  default: false,
})

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

export const hotkeysAtom = atom<Hotkeys>({
  key: 'hotkeysAtom',
  default: {},
})

export const hiddenTileIdsAtom = atom<string[]>({
  key: 'hiddenTileIdsAtom',
  default: [],
})

/**
 * -----------------------------------------------------------------------------
 * SELECTORS
 * -----------------------------------------------------------------------------
 */

/**
 * Hotkeys on or off
 */
export const areHotKeysEnabledSelector = selector<boolean>({
  key: 'areHotKeysEnabledSelector',
  get: ({ get }) => {
    const menu = get(openMenuAtom)
    if (menu) {
      return false
    }

    return true
  },
})

/**
 * Certain menus cause side effects when set
 */
export const openMenuSelector = selector<MenuState>({
  key: 'openMenuSelector',
  get: ({ get }) => {
    return get(openMenuAtom)
  },
  set: ({ set, get }, menu) => {
    const currentMenu = get(openMenuAtom)
    if (currentMenu === menu || !menu) {
      set(openMenuAtom, false)
    } else {
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
