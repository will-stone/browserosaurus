import clsx from 'clsx'
import React from 'react'

import { useFavTileSelector, useNormalTilesSelector } from '../store/selectors'
import MouseDiv from './organisms/mouse-div'
import Tile from './organisms/tile'

const Tiles: React.FC = () => {
  const favTile = useFavTileSelector()
  const normalTiles = useNormalTilesSelector()

  let p = 'p-1'

  if (normalTiles.length < 8) {
    p = 'p-4'
  } else if (normalTiles.length < 16) {
    p = 'p-2'
  }

  return (
    <MouseDiv
      capture
      className={clsx(
        'relative',
        'border border-grey-600',
        'bg-grey-800',
        'p-2',
        'flex justify-start',
        'rounded-md shadow',
        'max-w-full overflow-x-auto',
      )}
    >
      {favTile && <Tile app={favTile} className={p} isFav />}
      {normalTiles.map((app, i) => {
        const key = app.id + i
        return <Tile key={key} app={app} className={p} />
      })}
    </MouseDiv>
  )
}

export default Tiles
