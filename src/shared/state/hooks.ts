import deepEqual from 'fast-deep-equal'
import {
  shallowEqual,
  TypedUseSelectorHook,
  useSelector as useReduxSelector,
} from 'react-redux'

import type { AppId, Apps } from '../../config/apps'
import { apps as allApps } from '../../config/apps'
import { getHotkeyByAppId } from '../utils/get-hotkey-by-app-id'
import type { RootState } from './reducer.root'

export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector

export const useShallowEqualSelector: TypedUseSelectorHook<RootState> = (
  selector,
) => useSelector(selector, shallowEqual)

export const useDeepEqualSelector: TypedUseSelectorHook<RootState> = (
  selector,
) => useSelector(selector, deepEqual)

export interface App {
  id: AppId
  name: Apps[AppId]['name']
  privateArg?: string
  urlTemplate?: string
  isVisible: boolean
  isFav: boolean
  hotkey: string | undefined
}

export const useApps = (): App[] => {
  const appIds = useDeepEqualSelector((state) => state.apps)
  const hiddenTileIds = useShallowEqualSelector(
    (state) => state.storage.hiddenTileIds,
  )
  const favId = useSelector((state) => state.storage.fav)
  const hotkeys = useShallowEqualSelector((state) => state.storage.hotkeys)
  return appIds.map((appId) => ({
    ...allApps[appId],
    id: appId,
    isVisible: !hiddenTileIds.includes(appId),
    isFav: appId === favId,
    hotkey: getHotkeyByAppId(hotkeys, appId),
  }))
}

/**
 * Tiles = visible apps
 */
const useTiles = (): App[] => {
  const apps = useApps()
  return apps.filter((app) => app.isVisible)
}

export const useFavTile = (): App | undefined => {
  const tiles = useTiles()
  const favTile = tiles.find((tile) => tile.isFav)
  return favTile
}

export const useNormalTiles = (): App[] => {
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
