import { faGift } from '@fortawesome/pro-solid-svg-icons/faGift'
import { faKeyboard } from '@fortawesome/pro-solid-svg-icons/faKeyboard'
import { faSignOutAlt } from '@fortawesome/pro-solid-svg-icons/faSignOutAlt'
import { faStar } from '@fortawesome/pro-solid-svg-icons/faStar'
import { faSync } from '@fortawesome/pro-solid-svg-icons/faSync'
import { faTimes } from '@fortawesome/pro-solid-svg-icons/faTimes'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import cc from 'classcat'
import { shell } from 'electron'
import electronIsDev from 'electron-is-dev'
import React, { useCallback } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

import { quit, reload, setAsDefaultBrowser } from '../sendToMain'
import {
  isDefaultBrowserAtom,
  openMenuSelector,
  updateAvailableAtom,
  versionAtom,
} from '../state'
import { LightButton } from './button'

interface Props {
  className?: string
}

const TheStatusBar: React.FC<Props> = ({ className }) => {
  const [openMenu, setOpenMenu] = useRecoilState(openMenuSelector)
  const isDefaultBrowser = useRecoilValue(isDefaultBrowserAtom)
  const updateAvailable = useRecoilValue(updateAvailableAtom)
  const version = useRecoilValue(versionAtom)

  const handleUpdateClick = useCallback(
    () => shell.openExternal('https://browserosaurus.com'),
    [],
  )

  const handleFavMenuClick = useCallback(() => {
    setOpenMenu((menu) => (menu === 'fav' ? false : 'fav'))
  }, [setOpenMenu])

  const handleHotKeysMenuClick = useCallback(() => {
    setOpenMenu((menu) => (menu === 'hotkeys' ? false : 'hotkeys'))
  }, [setOpenMenu])

  const displayedVersion = version
    ? `v${version}${electronIsDev ? ' DEV' : ''}`
    : ''

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

        <LightButton
          className={cc([{ 'z-30': openMenu === 'hotkeys' }])}
          onClick={handleHotKeysMenuClick}
        >
          {openMenu === 'hotkeys' ? (
            <FontAwesomeIcon fixedWidth icon={faTimes} />
          ) : (
            <FontAwesomeIcon fixedWidth icon={faKeyboard} />
          )}
        </LightButton>

        {!isDefaultBrowser && (
          <LightButton onClick={setAsDefaultBrowser}>
            Set As Default Browser
          </LightButton>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <div className="text-xs text-grey-500 text-bold">
          {displayedVersion}
        </div>

        {updateAvailable && (
          <LightButton onClick={handleUpdateClick} tone="primary">
            <FontAwesomeIcon icon={faGift} />
            <span>Update Available</span>
          </LightButton>
        )}

        <LightButton onClick={reload}>
          <FontAwesomeIcon fixedWidth icon={faSync} />
        </LightButton>

        <LightButton onClick={quit}>
          <FontAwesomeIcon fixedWidth icon={faSignOutAlt} />
        </LightButton>
      </div>
    </div>
  )
}

export default TheStatusBar
