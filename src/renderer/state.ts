import { atom, DefaultValue, selector } from 'recoil'

import { Browser } from '../config/browsers'
import { Hotkeys } from '../main/store'
import { updateFav, updateHotkeys } from './sendToMain'

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

/**
 * Hotkeys Selector
 */
export const hotkeysSelector = selector<Hotkeys>({
  key: 'hotkeysSelector',
  get: ({ get }) => {
    return get(hotkeysAtom)
  },
  set: ({ set }, hotkeys) => {
    if (!(hotkeys instanceof DefaultValue)) {
      updateHotkeys(hotkeys)
      set(hotkeysAtom, hotkeys)
    }
  },
})

/**
 * Fav Browser ID Selector
 */
export const favBrowserIdSelector = selector<string>({
  key: 'favBrowserIdSelector',
  get: ({ get }) => {
    return get(favBrowserIdAtom)
  },
  set: ({ set }, browserId) => {
    if (!(browserId instanceof DefaultValue)) {
      updateFav(browserId)
      set(favBrowserIdAtom, browserId)
    }
  },
})
