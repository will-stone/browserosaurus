import { App } from '../../config/types'
import { getHotkeyByAppId } from '../../utils/getHotkeyByAppId'
import { useDeepEqualSelector, useSelector, useShallowEqualSelector } from '.'

export interface ExtendedApp extends App {
  isVisible: boolean
  isFav: boolean
  hotkey: App['id'] | undefined
}

export const useApps = (): ExtendedApp[] => {
  const apps = useDeepEqualSelector((state) => state.apps)
  const hiddenTileIds = useShallowEqualSelector(
    (state) => state.ui.hiddenTileIds,
  )
  const favId = useSelector((state) => state.ui.fav)
  const hotkeys = useShallowEqualSelector((state) => state.ui.hotkeys)
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

/**
 * Dark mode
 */
export const useIsDarkMode = (): boolean =>
  useSelector((state) => state.theme.isDarkMode)
