import clsx from 'clsx'
import React from 'react'

import { useNormalTilesSelector } from '../store/selectors'
import Tile from './app__tiles__tile'

const Tiles: React.FC = () => {
  const normalTiles = useNormalTilesSelector()

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment -- ts does not like returning arrays of elements
    <>
      {normalTiles.map((app) => (
        <Tile
          key={app.id}
          app={app}
          className={clsx(normalTiles.length > 10 ? 'mx-1' : 'mx-3')}
        />
      ))}
    </>
  )
}

export default Tiles
