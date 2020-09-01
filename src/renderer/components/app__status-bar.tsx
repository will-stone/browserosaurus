import { faGift } from '@fortawesome/free-solid-svg-icons/faGift'
import { faGripHorizontal } from '@fortawesome/free-solid-svg-icons/faGripHorizontal'
import { faHeart } from '@fortawesome/free-solid-svg-icons/faHeart'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons/faSignOutAlt'
import { faSync } from '@fortawesome/free-solid-svg-icons/faSync'
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import clsx from 'clsx'
import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { quit, reload, setAsDefaultBrowser, updateRestart } from '../sendToMain'
import { useSelector } from '../store'
import {
  clickedSponsorMenuButton,
  clickedTilesMenuButton,
} from '../store/actions'
import { DarkButton } from './atoms/button'

interface Props {
  className?: string
}

const StatusBar: React.FC<Props> = ({ className }) => {
  const dispatch = useDispatch()
  const openMenu = useSelector((state) => state.ui.menu)
  const isDefaultProtocolClient = useSelector(
    (state) => state.ui.isDefaultProtocolClient,
  )
  const updateStatus = useSelector((state) => state.ui.updateStatus)
  const version = useSelector((state) => state.ui.version)

  const displayedVersion = version || ''

  const handleTilesMenuButtonClick = useCallback(() => {
    dispatch(clickedTilesMenuButton())
  }, [dispatch])

  const handleSponsorMenuButtonClick = useCallback(() => {
    dispatch(clickedSponsorMenuButton())
  }, [dispatch])

  return (
    <div
      className={clsx(
        className,
        'flex-shrink-0 leading-none flex justify-end items-center space-x-2',
      )}
    >
      <DarkButton
        aria-label="Tiles Menu"
        className={clsx(openMenu === 'tiles' && 'z-20')}
        onClick={handleTilesMenuButtonClick}
      >
        {openMenu === 'tiles' ? (
          <FontAwesomeIcon fixedWidth icon={faTimes} />
        ) : (
          <FontAwesomeIcon fixedWidth icon={faGripHorizontal} />
        )}
      </DarkButton>

      {!isDefaultProtocolClient && (
        <DarkButton onClick={setAsDefaultBrowser}>
          Set As Default Browser
        </DarkButton>
      )}

      <div className="text-xs text-grey-500 text-bold">
        {updateStatus === 'available'
          ? 'Downloading update…'
          : displayedVersion}
      </div>

      <DarkButton
        className={clsx(openMenu === 'sponsor' && 'z-20')}
        onClick={handleSponsorMenuButtonClick}
        tone={openMenu === 'sponsor' ? undefined : 'sponsor'}
      >
        {openMenu === 'sponsor' ? (
          <FontAwesomeIcon fixedWidth icon={faTimes} />
        ) : (
          <FontAwesomeIcon fixedWidth icon={faHeart} />
        )}
      </DarkButton>

      {updateStatus === 'downloaded' && (
        <DarkButton onClick={updateRestart} tone="primary">
          <FontAwesomeIcon icon={faGift} />
          <span>Update</span>
        </DarkButton>
      )}

      {updateStatus !== 'downloaded' && (
        <>
          <DarkButton onClick={reload}>
            <FontAwesomeIcon fixedWidth icon={faSync} />
          </DarkButton>
          <DarkButton onClick={quit}>
            <FontAwesomeIcon fixedWidth icon={faSignOutAlt} />
          </DarkButton>
        </>
      )}
    </div>
  )
}

export default StatusBar
