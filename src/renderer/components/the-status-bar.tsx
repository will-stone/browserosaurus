import { faGift } from '@fortawesome/pro-solid-svg-icons/faGift'
import { faGripHorizontal } from '@fortawesome/pro-solid-svg-icons/faGripHorizontal'
import { faHeart } from '@fortawesome/pro-solid-svg-icons/faHeart'
import { faSignOutAlt } from '@fortawesome/pro-solid-svg-icons/faSignOutAlt'
import { faSync } from '@fortawesome/pro-solid-svg-icons/faSync'
import { faTimes } from '@fortawesome/pro-solid-svg-icons/faTimes'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import cc from 'classcat'
import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { useRecoilValue } from 'recoil'

import { quit, reload, setAsDefaultBrowser, updateRestart } from '../sendToMain'
import {
  isDefaultBrowserAtom,
  isUpdateAvailableAtom,
  versionAtom,
} from '../state'
import { useSelector } from '../store'
import {
  clickedSponsorMenuButton,
  clickedTilesMenuButton,
} from '../store/actions'
import { LightButton } from './button'

interface Props {
  className?: string
}

const TheStatusBar: React.FC<Props> = ({ className }) => {
  const dispatch = useDispatch()
  const openMenu = useSelector((state) => state.ui.menu)
  const isDefaultBrowser = useRecoilValue(isDefaultBrowserAtom)
  const isUpdateAvailable = useRecoilValue(isUpdateAvailableAtom)
  const version = useRecoilValue(versionAtom)

  const displayedVersion = version || ''

  const handleTilesMenuButtonClick = useCallback(() => {
    dispatch(clickedTilesMenuButton())
  }, [dispatch])

  const handleSponsorMenuButtonClick = useCallback(() => {
    dispatch(clickedSponsorMenuButton())
  }, [dispatch])

  return (
    <div
      className={cc([
        className,
        'h-16 px-4 bg-grey-700 flex items-center justify-between overflow-hidden text-xs font-bold space-x-4',
      ])}
    >
      <div className="flex items-center space-x-2">
        <LightButton
          className={cc([{ 'z-20': openMenu === 'tiles' }])}
          onClick={handleTilesMenuButtonClick}
        >
          {openMenu === 'tiles' ? (
            <FontAwesomeIcon fixedWidth icon={faTimes} />
          ) : (
            <FontAwesomeIcon fixedWidth icon={faGripHorizontal} />
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

        <LightButton
          className={cc([{ 'z-20': openMenu === 'sponsor' }])}
          onClick={handleSponsorMenuButtonClick}
          tone={openMenu === 'sponsor' ? undefined : 'sponsor'}
        >
          {openMenu === 'sponsor' ? (
            <FontAwesomeIcon fixedWidth icon={faTimes} />
          ) : (
            <FontAwesomeIcon fixedWidth icon={faHeart} />
          )}
        </LightButton>

        {isUpdateAvailable ? (
          <LightButton onClick={updateRestart} tone="primary">
            <FontAwesomeIcon icon={faGift} />
            <span>Update</span>
          </LightButton>
        ) : (
          <>
            <LightButton onClick={reload}>
              <FontAwesomeIcon fixedWidth icon={faSync} />
            </LightButton>
            <LightButton onClick={quit}>
              <FontAwesomeIcon fixedWidth icon={faSignOutAlt} />
            </LightButton>
          </>
        )}
      </div>
    </div>
  )
}

export default TheStatusBar
