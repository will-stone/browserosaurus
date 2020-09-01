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
      <div className="text-xxs text-grey-500 font-bold">
        {updateStatus === 'available'
          ? 'Downloading update…'
          : displayedVersion}
      </div>

      {!isDefaultProtocolClient && (
        <DarkButton
          className="opacity-50"
          onClick={setAsDefaultBrowser}
          title="Accept incoming URLs"
        >
          Set As Default Browser
        </DarkButton>
      )}

      <DarkButton
        aria-label="Tiles Menu"
        className={clsx(openMenu === 'tiles' && 'z-20')}
        onClick={handleTilesMenuButtonClick}
      >
        {openMenu === 'tiles' ? (
          <FontAwesomeIcon fixedWidth icon={faTimes} title="Close menu" />
        ) : (
          <FontAwesomeIcon
            fixedWidth
            icon={faGripHorizontal}
            title="Tiles menu"
          />
        )}
      </DarkButton>

      <DarkButton
        className={clsx(openMenu === 'sponsor' && 'z-20')}
        onClick={handleSponsorMenuButtonClick}
        tone={openMenu === 'sponsor' ? undefined : 'sponsor'}
      >
        {openMenu === 'sponsor' ? (
          <FontAwesomeIcon fixedWidth icon={faTimes} title="Close menu" />
        ) : (
          <FontAwesomeIcon
            fixedWidth
            icon={faHeart}
            title="Sponsor information"
          />
        )}
      </DarkButton>

      {updateStatus === 'downloaded' && (
        <DarkButton
          onClick={updateRestart}
          title="Restart app and update"
          tone="primary"
        >
          <FontAwesomeIcon icon={faGift} />
          <span>Update</span>
        </DarkButton>
      )}

      {updateStatus !== 'downloaded' && (
        <>
          <DarkButton onClick={reload} title="Reload">
            <FontAwesomeIcon fixedWidth icon={faSync} />
          </DarkButton>
          <DarkButton onClick={quit} title="Quit">
            <FontAwesomeIcon fixedWidth icon={faSignOutAlt} />
          </DarkButton>
        </>
      )}
    </div>
  )
}

export default StatusBar
