import clsx from 'clsx'
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
    <div className={clsx('relative flex-grow w-full', 'overflow-y-scroll')}>
      <div className="flex justify-start items-center flex-wrap">
        {!isEditMode && favTile && <Tile app={favTile} isFav />}
        {tiles.map((app, index) => {
          const key = app.id + index
          return <Tile key={key} app={app} />
        })}
      </div>
    </div>
  )
}

export default Tiles
