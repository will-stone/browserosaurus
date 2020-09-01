import React from 'react'

import { useFavTileSelector } from '../store/selectors'
import Noop from './atoms/noop'
import Tile from './organisms/tile'

const FavTile: React.FC = () => {
  const favTile = useFavTileSelector()

  if (favTile) {
    return <Tile app={favTile} isFav />
  }

  return <Noop />
}

export default FavTile
