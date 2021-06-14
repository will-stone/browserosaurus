import React from 'react'

import { useSelector } from '../../store'
import { useApps, useFavTile, useNormalTiles } from '../../store/selector-hooks'
import Tile from '../molecules/tile'

const Tiles: React.FC = () => {
  const favTile = useFavTile()
  const normalTiles = useNormalTiles()
  const allApps = useApps()
  const isEditMode = useSelector((state) => state.ui.isEditMode)

  const tiles = isEditMode ? allApps : normalTiles

  return (
    <div className="relative flex-grow w-full overflow-y-scroll mr-1">
      <div className="flex justify-start items-center flex-wrap">
        {/* Favourite is first */}
        {!isEditMode && favTile && <Tile app={favTile} />}

        {/* Rest of the tiles */}
        {tiles.map((app, index) => {
          const key = app.id + index
          return <Tile key={key} app={app} />
        })}
      </div>
    </div>
  )
}

export default Tiles
