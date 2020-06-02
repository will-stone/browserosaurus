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
        <button
          className={cc([
            'bg-grey-600',
            'border border-grey-900 rounded shadow-md active:shadow-none focus:outline-none',
            'text-xs active:text-grey-200 font-bold',
            'h-8 px-3',
            'cursor-default',
            { 'z-30': openMenu === 'fav' },
          ])}
          onClick={handleFavMenuClick}
          type="button"
        >
          {openMenu === 'fav' ? (
            <FontAwesomeIcon fixedWidth icon={faTimes} />
          ) : (
            <FontAwesomeIcon fixedWidth icon={faStar} />
          )}
        </button>

        <button
          className={cc([
            'bg-grey-600',
            'border border-grey-900 rounded active:shadow-none focus:outline-none',
            'text-xs font-bold',
            'h-8 px-3',
            'cursor-default',
            { 'shadow-md active:text-grey-200': !protocolStatus },
            { 'text-grey-500 bg-grey-700': protocolStatus },
          ])}
          disabled={protocolStatus}
          onClick={setAsDefaultBrowser}
          type="button"
        >
          Set As Default Browser
        </button>
      </div>

      <div className="flex items-center space-x-2">
        <button
          className={cc([
            'bg-grey-600',
            'border border-grey-900 rounded active:shadow-none focus:outline-none',
            'text-xs font-bold',
            'h-8 px-3',
            'inline-flex items-center space-x-2',
            'cursor-default',
            { 'shadow-md text-blue-500 active:text-grey-200': updateAvailable },
            { 'text-grey-500 bg-grey-700': !updateAvailable },
          ])}
          disabled={!updateAvailable}
          onClick={handleUpdateClick}
          type="button"
        >
          {updateAvailable ? (
            <>
              <FontAwesomeIcon icon={faCheeseSwiss} />
              <span>Update Available</span>
            </>
          ) : (
            `v${version}`
          )}
        </button>

        <button
          className={cc([
            'bg-grey-600',
            'border border-grey-900 rounded shadow-md active:shadow-none focus:outline-none',
            'text-xs active:text-grey-200 font-bold',
            'h-8 px-3',
            'cursor-default',
          ])}
          onClick={quit}
          type="button"
        >
          <FontAwesomeIcon fixedWidth icon={faSignOutAlt} />
        </button>
      </div>
    </div>
  )
}

export default TheStatusBar
