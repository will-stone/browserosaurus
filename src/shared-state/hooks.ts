import deepEqual from 'fast-deep-equal'
import {
  shallowEqual,
  TypedUseSelectorHook,
  useSelector as useReduxSelector,
} from 'react-redux'

import { getHotkeyByAppId } from '../utils/get-hotkey-by-app-id'
import type { App } from './reducer.apps'
import type { RootState } from './reducer.root'

export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector

export const useShallowEqualSelector: TypedUseSelectorHook<RootState> = (
  selector,
) => useSelector(selector, shallowEqual)

export const useDeepEqualSelector: TypedUseSelectorHook<RootState> = (
  selector,
) => useSelector(selector, deepEqual)

export interface ExtendedApp extends App {
  isVisible: boolean
  isFav: boolean
  hotkey: App['id'] | undefined
}

export const useApps = (): ExtendedApp[] => {
  const apps = useDeepEqualSelector((state) => state.apps)
  const hiddenTileIds = useShallowEqualSelector(
    (state) => state.storage.hiddenTileIds,
  )
  const favId = useSelector((state) => state.storage.fav)
  const hotkeys = useShallowEqualSelector((state) => state.storage.hotkeys)
  return apps.map((app) => ({
    ...app,
    isVisible: !hiddenTileIds.includes(app.id),
    isFav: app.id === favId,
    hotkey: getHotkeyByAppId(hotkeys, app.id),
  }))
}

/**
 * Tiles = visible apps
 */
const useTiles = (): ExtendedApp[] => {
  const apps = useApps()
  return apps.filter((app) => app.isVisible)
}

export const useFavTile = (): ExtendedApp | undefined => {
  const tiles = useTiles()
  const favTile = tiles.find((tile) => tile.isFav)
  return favTile
}

export const useNormalTiles = (): ExtendedApp[] => {
  const tiles = useTiles()
  const normalTiles = tiles
    .filter((tile) => !tile.isFav)
    .sort((a, b) => {
      if (!a.hotkey) return 1
      if (!b.hotkey) return -1
      if (a.hotkey < b.hotkey) return -1
      if (a.hotkey > b.hotkey) return 1
      return 0
    })
  return normalTiles
}

export const useIsSupportMessageHidden = (): boolean => {
  const supportMessageNumber = useSelector(
    (state) => state.storage.supportMessage,
  )

  const ONE_WEEK = 604_800_000

  return (
    // Hidden by user
    supportMessageNumber === -1 ||
    // Snoozing
    supportMessageNumber > Date.now() - ONE_WEEK
  )
}
