import { faCheeseSwiss } from '@fortawesome/pro-solid-svg-icons/faCheeseSwiss'
import { faSignOutAlt } from '@fortawesome/pro-solid-svg-icons/faSignOutAlt'
import { faStar } from '@fortawesome/pro-solid-svg-icons/faStar'
import { faTimes } from '@fortawesome/pro-solid-svg-icons/faTimes'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import cc from 'classcat'
import { shell } from 'electron'
import React, { useCallback } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

import {
  openMenuAtom,
  protocolStatusAtom,
  updateAvailableAtom,
  versionAtom,
} from '../atoms'
import { quit, setAsDefaultBrowser } from '../sendToMain'
import StatusBarButton from './status-bar-button'

interface Props {
  className?: string
}

const TheStatusBar: React.FC<Props> = ({ className }) => {
  const [openMenu, setOpenMenu] = useRecoilState(openMenuAtom)
  const protocolStatus = useRecoilValue(protocolStatusAtom)
  const updateAvailable = useRecoilValue(updateAvailableAtom)
  const version = useRecoilValue(versionAtom)

  const handleUpdateClick = useCallback(
    () => shell.openExternal('https://browserosaurus.com'),
    [],
  )

  const handleFavMenuClick = useCallback(() => {
    setOpenMenu(openMenu === 'fav' ? false : 'fav')
  }, [openMenu, setOpenMenu])

  return (
    <div
      className={cc([
        className,
        'h-16 px-4 bg-grey-700 flex items-center justify-between overflow-hidden text-xs font-bold space-x-4',
      ])}
    >
      <div className="flex items-center space-x-2">
        <StatusBarButton
          className={cc([{ 'z-30': openMenu === 'fav' }])}
          onClick={handleFavMenuClick}
        >
          {openMenu === 'fav' ? (
            <FontAwesomeIcon fixedWidth icon={faTimes} />
          ) : (
            <FontAwesomeIcon fixedWidth icon={faStar} />
          )}
        </StatusBarButton>

        <StatusBarButton
          disabled={protocolStatus}
          onClick={setAsDefaultBrowser}
        >
          Set As Default Browser
        </StatusBarButton>
      </div>

      <div className="flex items-center space-x-2">
        <StatusBarButton
          disabled={!updateAvailable}
          onClick={handleUpdateClick}
          tone={updateAvailable ? 'primary' : undefined}
        >
          {updateAvailable ? (
            <>
              <FontAwesomeIcon icon={faCheeseSwiss} />
              <span>Update Available</span>
            </>
          ) : (
            `v${version}`
          )}
        </StatusBarButton>

        <StatusBarButton onClick={quit}>
          <FontAwesomeIcon fixedWidth icon={faSignOutAlt} />
        </StatusBarButton>
      </div>
    </div>
  )
}

export default TheStatusBar
