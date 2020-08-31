import { faHeart } from '@fortawesome/free-solid-svg-icons/faHeart'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
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

        <div className="flex-shrink-0 leading-none text-right">
          <button
            className={clsx(
              'bg-grey-700',
              'px-2 py-1',
              'mr-2',
              'rounded-md',
              'text-pink-400 text-xs font-bold leading-none focus:outline-none',
            )}
            type="button"
          >
            <FontAwesomeIcon fixedWidth icon={faHeart} />
          </button>

          <button
            className={clsx(
              'bg-grey-700',
              'px-2 py-1',
              'rounded-md',
              'text-xs font-bold leading-none focus:outline-none',
            )}
            type="button"
          >
            Menu
          </button>
        </div>
      </div>
    </div>
  )
}

export default Tiles
