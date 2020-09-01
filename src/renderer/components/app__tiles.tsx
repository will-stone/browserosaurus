import clsx from 'clsx'
import React from 'react'

import { useSelector, useShallowEqualSelector } from '../store'
import StatusBar from './app__status-bar'
import Tile from './app__tiles__tile'

const Tiles: React.FC = () => {
  const apps = useShallowEqualSelector((state) => state.apps)
  const hiddenTileIds = useShallowEqualSelector(
    (state) => state.mainStore.hiddenTileIds,
  )
  const favAppId = useSelector((state) => state.mainStore.fav)
  const visibleTiles = apps.filter((b) => !hiddenTileIds.includes(b.id))
  const favTile = visibleTiles.find((a) => a.id === favAppId)
  const nonFavVisibleTiles = visibleTiles.filter((a) => a.id !== favAppId)

  return (
    <div className="flex-grow flex items-center overflow-hidden">
      {favTile && <Tile app={favTile} isFav />}

      <div className="flex-grow overflow-hidden flex flex-col h-full">
        <div className="flex-grow flex items-center overflow-hidden">
          {nonFavVisibleTiles.map((app) => (
            <Tile
              key={app.id}
              app={app}
              className={clsx(nonFavVisibleTiles.length > 10 ? 'mx-1' : 'mx-3')}
            />
          ))}
        </div>

        <StatusBar />
      </div>
    </div>
  )
}

export default Tiles
