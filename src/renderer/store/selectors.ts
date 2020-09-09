import { App } from '../../config/types'
import { useSelector, useShallowEqualSelector } from '.'

export const useTilesSelector = (): App[] => {
  const apps = useShallowEqualSelector((state) => state.apps)
  const hiddenTileIds = useShallowEqualSelector(
    (state) => state.mainStore.hiddenTileIds,
  )
  const tiles = apps.filter((b) => !hiddenTileIds.includes(b.id))

  return tiles
}

export const useFavAppIdSelector = (): string => {
  const favAppId = useSelector((state) => state.mainStore.fav)
  return favAppId
}

export const useFavTileSelector = (): App | undefined => {
  const tiles = useTilesSelector()
  const favAppId = useFavAppIdSelector()
  const favTile = tiles.find((a) => a.id === favAppId)

  return favTile
}

export const useNormalTilesSelector = (): App[] => {
  const tiles = useTilesSelector()
  const favAppId = useFavAppIdSelector()
  const normalTiles = tiles.filter((a) => a.id !== favAppId)

  return [
    ...normalTiles,
    // ...normalTiles,
    // ...normalTiles,
    // ...normalTiles,
    // ...normalTiles,
  ]
}
