// Allow setting backdrop div as clickable
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import cc from 'classcat'
import React, { useCallback } from 'react'
import { useRecoilState } from 'recoil'

import { openMenuSelector } from '../state'
import Noop from './noop'
import TheFavMenu from './the-fav-menu'
import TheHotkeysMenu from './the-hotkeys-menu'

const TheMenuManager: React.FC = () => {
  const [openMenu, setOpenMenu] = useRecoilState(openMenuSelector)

  const handleBgClick = useCallback(() => {
    setOpenMenu(false)
  }, [setOpenMenu])

  let Menu

  if (openMenu === 'fav') {
    Menu = TheFavMenu
  } else if (openMenu === 'hotkeys') {
    Menu = TheHotkeysMenu
  }

  if (Menu) {
    return (
      <>
        <div
          className={cc([
            'absolute top-0 left-0 right-0 bottom-0 bg-grey-900 bg-opacity-75 z-10',
            'animate__animated animate__fadeIn animate__faster',
          ])}
          onClick={handleBgClick}
        />
        <Menu />
      </>
    )
  }

  return <Noop />
}

export default TheMenuManager
