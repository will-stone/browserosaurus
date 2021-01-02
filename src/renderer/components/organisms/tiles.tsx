import clsx from 'clsx'
import React from 'react'
import { useDispatch } from 'react-redux'

import { useSelector } from '../../store'
import { clickedOkToAffliateButton } from '../../store/actions'
import {
  useAffliateApp,
  useApps,
  useFavTile,
  useNormalTiles,
} from '../../store/selector-hooks'
import Tile from '../molecules/tile'

const Tiles: React.FC = () => {
  const dispatch = useDispatch()
  const favTile = useFavTile()
  const normalTiles = useNormalTiles()
  const allApps = useApps()
  const isEditMode = useSelector((state) => state.ui.isEditMode)
  const affliateApp = useAffliateApp()

  const tiles = isEditMode ? allApps : normalTiles

  return (
    <div className={clsx('relative flex-grow w-full', 'overflow-y-scroll')}>
      <div className="flex justify-start items-center flex-wrap">
        {/* Favourite */}
        {!isEditMode && favTile && (
          <Tile
            app={favTile}
            controls={{ favourite: true, hotkey: true, visibility: true }}
          />
        )}

        {/* Affliate */}
        {affliateApp && ((!isEditMode && affliateApp.isVisible) || isEditMode) && (
          <Tile
            app={affliateApp}
            controls={{ favourite: false, hotkey: false, visibility: true }}
            onClick={() => {
              // eslint-disable-next-line no-alert
              const confirmResult = window.confirm(
                `Browserosaurus is free and funded by only a few. We have partnered with Polypane and would be grateful if you could check out this innovative browser made for web development by following the affiliate link in your chosen browser`,
              )

              if (confirmResult) {
                dispatch(clickedOkToAffliateButton())
              }
            }}
          >
            <div className="text-xs opacity-50">Affliate</div>
          </Tile>
        )}

        {/* Rest of the tiles */}
        {tiles.map((app, index) => {
          const key = app.id + index
          return (
            <Tile
              key={key}
              app={app}
              controls={{ favourite: true, hotkey: true, visibility: true }}
            />
          )
        })}
      </div>
    </div>
  )
}

export default Tiles
