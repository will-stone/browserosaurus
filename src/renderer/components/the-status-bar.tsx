import { faGift } from '@fortawesome/pro-solid-svg-icons/faGift'
import { faSignOutAlt } from '@fortawesome/pro-solid-svg-icons/faSignOutAlt'
import { faStar } from '@fortawesome/pro-solid-svg-icons/faStar'
import { faTimes } from '@fortawesome/pro-solid-svg-icons/faTimes'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import cc from 'classcat'
import { shell } from 'electron'
import electronIsDev from 'electron-is-dev'
import React, { useCallback } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

import {
  isDefaultBrowserAtom,
  openMenuAtom,
  updateAvailableAtom,
  versionAtom,
} from '../atoms'
import { quit, setAsDefaultBrowser } from '../sendToMain'
import { LightButton } from './button'

interface Props {
  className?: string
}

const TheStatusBar: React.FC<Props> = ({ className }) => {
  const [openMenu, setOpenMenu] = useRecoilState(openMenuAtom)
  const isDefaultBrowser = useRecoilValue(isDefaultBrowserAtom)
  const updateAvailable = useRecoilValue(updateAvailableAtom)
  const version = useRecoilValue(versionAtom)

  const handleUpdateClick = useCallback(
    () => shell.openExternal('https://browserosaurus.com'),
    [],
  )

  const handleFavMenuClick = useCallback(() => {
    setOpenMenu(openMenu === 'fav' ? false : 'fav')
  }, [openMenu, setOpenMenu])

  const displayedVersion = `v${version}${electronIsDev ? ' DEV' : ''}`

  return (
    <div
      className={cc([
        className,
        'h-16 px-4 bg-grey-700 flex items-center justify-between overflow-hidden text-xs font-bold space-x-4',
      ])}
    >
      <div className="flex items-center space-x-2">
        <LightButton
          className={cc([{ 'z-30': openMenu === 'fav' }])}
          onClick={handleFavMenuClick}
        >
          {openMenu === 'fav' ? (
            <FontAwesomeIcon fixedWidth icon={faTimes} />
          ) : (
            <FontAwesomeIcon fixedWidth icon={faStar} />
          )}
        </LightButton>

        {!isDefaultBrowser && (
          <LightButton onClick={setAsDefaultBrowser}>
            Set As Default Browser
          </LightButton>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <div className="text-xs text-grey-600 text-bold">
          {displayedVersion}
        </div>

        {updateAvailable && (
          <LightButton onClick={handleUpdateClick} tone="primary">
            <FontAwesomeIcon icon={faGift} />
            <span>Update Available</span>
          </LightButton>
        )}

        <LightButton onClick={quit}>
          <FontAwesomeIcon fixedWidth icon={faSignOutAlt} />
        </LightButton>
      </div>
    </div>
  )
}

export default TheStatusBar
