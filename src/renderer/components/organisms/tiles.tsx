import clsx from 'clsx'
import React from 'react'

import { useFavTile, useNormalTiles } from '../../store/selector-hooks'
import Tile from '../molecules/tile'

const Tiles: React.FC = () => {
  const favTile = useFavTile()
  const normalTiles = useNormalTiles()

  return (
    <div className={clsx('relative flex-grow w-full', 'overflow-y-scroll')}>
      <div className="pb-8 flex justify-center items-center flex-wrap">
        {favTile && <Tile app={favTile} isFav />}
        {normalTiles.map((app, index) => {
          const key = app.id + index
          return <Tile key={key} app={app} />
        })}
      </div>
    </div>
  )
}

export default Tiles
