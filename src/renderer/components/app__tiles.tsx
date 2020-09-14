import clsx from 'clsx'
import { css } from 'emotion'
import React from 'react'

import { useSelector } from '../store'
import { useFavTileSelector, useNormalTilesSelector } from '../store/selectors'
import { themes } from '../themes'
import MouseDiv from './organisms/mouse-div'
import Tile from './organisms/tile'

const Tiles: React.FC = () => {
  const favTile = useFavTileSelector()
  const normalTiles = useNormalTilesSelector()
  const theme = useSelector((state) => state.mainStore.theme)

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
        'border-2',
        'p-2',
        'flex justify-start',
        'rounded-md shadow',
        'max-w-full overflow-x-auto',
        css({
          borderColor: themes[theme].tiles.border,
          backgroundColor: themes[theme].tiles.bg,
        }),
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
