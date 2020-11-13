import clsx from 'clsx'
import React from 'react'

import { useFavTile, useNormalTiles } from '../../store/selector-hooks'
import Tile from '../molecules/tile'

const Tiles: React.FC = () => {
  const favTile = useFavTile()
  const normalTiles = useNormalTiles()

  return (
    <div
      className={clsx(
        'relative flex-grow',
        'flex justify-start items-center',
        'max-w-full overflow-x-auto',
      )}
    >
      <div className="px-20 flex justify-start items-center space-x-4">
        {favTile && <Tile app={favTile} className="p-1" isFav />}
        {normalTiles.map((app, index) => {
          const key = app.id + index
          return <Tile key={key} app={app} className="p-1" />
        })}
      </div>
    </div>
  )
}

export default Tiles
