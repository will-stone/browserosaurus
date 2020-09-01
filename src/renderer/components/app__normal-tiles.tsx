import React from 'react'

import { useNormalTilesSelector } from '../store/selectors'
import Tile from './organisms/tile'

const NormalTiles: React.FC = () => {
  const normalTiles = useNormalTilesSelector()

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment -- ts does not like returning arrays of elements
    <>
      {normalTiles.map((app) => (
        <Tile key={app.id} app={app} className="px-1" />
      ))}
    </>
  )
}

export default NormalTiles
