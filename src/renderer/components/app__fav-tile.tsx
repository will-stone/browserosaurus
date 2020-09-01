import React from 'react'

import { useFavTileSelector } from '../store/selectors'
import Tile from './app__tiles__tile'
import Noop from './atoms/noop'

const FavTile: React.FC = () => {
  const favTile = useFavTileSelector()

  if (favTile) {
    return <Tile app={favTile} isFav />
  }

  return <Noop />
}

export default FavTile
