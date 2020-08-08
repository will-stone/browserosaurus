import clsx from 'clsx'
import React from 'react'

import { useSelector, useShallowEqualSelector } from '../store'
import Tile from './app__tiles__tile'

const Tiles: React.FC = () => {
  const apps = useShallowEqualSelector((state) => state.apps)
  const hiddenTileIds = useShallowEqualSelector(
    (state) => state.mainStore.hiddenTileIds,
  )
  const favAppId = useSelector((state) => state.mainStore.fav)
  const visibleTiles = apps.filter((b) => !hiddenTileIds.includes(b.id))
  const sortedTiles = visibleTiles.sort((a, b) => {
    if (a.id === favAppId) return -1
    if (b.id === favAppId) return 1
    return 0
  })

  return (
    <div className={clsx('flex items-center h-full')}>
      {sortedTiles.map((app) => (
        <Tile key={app.id} app={app} isFav={app.id === favAppId} />
      ))}
    </div>
  )
}

export default Tiles
