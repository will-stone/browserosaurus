import clsx from 'clsx'
import React from 'react'
import { useDispatch } from 'react-redux'

import { useSelector } from '../../store'
import { clickedCarrotButton } from '../../store/actions'
import {
  useAffiliateApp,
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
  const affiliateApp = useAffiliateApp()

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

        {/* Affiliate */}
        {affiliateApp &&
          ((!isEditMode && affiliateApp.isVisible) || isEditMode) && (
            <Tile
              app={affiliateApp}
              controls={{ favourite: false, hotkey: false, visibility: true }}
              onClick={() => {
                // eslint-disable-next-line no-alert
                window.alert(
                  `Browserosaurus is free and funded by only a few. If you find Browserosaurus useful, please consider a contribution by following the Buy Me A Coffee link in your chosen browser.`,
                )

                dispatch(clickedCarrotButton())
              }}
            />
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
