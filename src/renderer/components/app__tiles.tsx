import clsx from 'clsx'
import React from 'react'

import { useFavTileSelector, useNormalTilesSelector } from '../store/selectors'
import Tile from './organisms/tile'

const Tiles: React.FC = () => {
  const favTile = useFavTileSelector()
  const normalTiles = useNormalTilesSelector()

  return (
    <div
      className={clsx(
        'flex-grow flex items-center justify-center overflow-hidden',
        normalTiles.length < 8 && 'space-x-8',
        normalTiles.length >= 8 && normalTiles.length < 16 && 'space-x-4',
        normalTiles.length >= 16 && 'space-x-1',
      )}
    >
      {favTile && <Tile app={favTile} isFav />}
      {normalTiles.map((app, i) => {
        const key = app.id + i
        return <Tile key={key} app={app} />
      })}
    </div>
  )
}

export default Tiles
