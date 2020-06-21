import { atom, DefaultValue, selector } from 'recoil'

import { Browser } from '../config/browsers'
import { Hotkeys } from '../main/store'
import { updateFav, updateHiddenTileIds, updateHotkeys } from './sendToMain'

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

const favBrowserIdAtom = atom<string>({
  key: 'favBrowserIdAtom',
  default: '',
})

export const isDefaultBrowserAtom = atom<boolean>({
  key: 'isDefaultBrowserAtom',
  default: true,
})

const hotkeysAtom = atom<Hotkeys>({
  key: 'hotkeysAtom',
  default: {},
})

const hiddenTileIdsAtom = atom<string[]>({
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
    // TODO should this be in its own selector? Get vs set other atom state?
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

export const hiddenTileIdsSelector = selector<string[]>({
  key: 'hiddenTileIdsSelector',
  get: ({ get }) => {
    return get(hiddenTileIdsAtom)
  },
  set: ({ set }, hiddenTileIds) => {
    if (!(hiddenTileIds instanceof DefaultValue)) {
      updateHiddenTileIds(hiddenTileIds)
      set(hiddenTileIdsAtom, hiddenTileIds)
    }
  },
})
