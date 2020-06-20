import { faGift } from '@fortawesome/pro-solid-svg-icons/faGift'
import { faGripHorizontal } from '@fortawesome/pro-solid-svg-icons/faGripHorizontal'
import { faHeart } from '@fortawesome/pro-solid-svg-icons/faHeart'
import { faSignOutAlt } from '@fortawesome/pro-solid-svg-icons/faSignOutAlt'
import { faSync } from '@fortawesome/pro-solid-svg-icons/faSync'
import { faTimes } from '@fortawesome/pro-solid-svg-icons/faTimes'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import cc from 'classcat'
import React, { useCallback } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

import { quit, reload, setAsDefaultBrowser, updateRestart } from '../sendToMain'
import {
  isDefaultBrowserAtom,
  isUpdateAvailableAtom,
  openMenuSelector,
  versionAtom,
} from '../state'
import { LightButton } from './button'

interface Props {
  className?: string
}

const TheStatusBar: React.FC<Props> = ({ className }) => {
  const [openMenu, setOpenMenu] = useRecoilState(openMenuSelector)
  const isDefaultBrowser = useRecoilValue(isDefaultBrowserAtom)
  const isUpdateAvailable = useRecoilValue(isUpdateAvailableAtom)
  const version = useRecoilValue(versionAtom)

  const displayedVersion = version || ''

  const handleMenuClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      const { name } = event.currentTarget
      // TODO turn this into proper type guard
      if (name === 'sponsor' || name === 'tiles') {
        setOpenMenu(name)
      }
    },
    [setOpenMenu],
  )

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
          name="tiles"
          onClick={handleMenuClick}
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
          name="sponsor"
          onClick={handleMenuClick}
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
