import React from 'react'

import { useFavTile, useNormalTiles } from '../../../../shared/state/hooks'
import Tile from '../molecules/tile'

const Tiles: React.FC = () => {
  const favTile = useFavTile()
  const normalTiles = useNormalTiles()

  return (
    <div className="relative flex-grow w-full overflow-y-scroll mr-1">
      <div className="flex justify-start items-center flex-wrap">
        {/* Favourite is first */}
        {favTile && <Tile app={favTile} />}

        {/* Rest of the tiles */}
        {normalTiles.map((app, index) => {
          const key = app.id + index
          return <Tile key={key} app={app} />
        })}
      </div>
    </div>
  )
}

export default Tiles
