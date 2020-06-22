// Allow setting backdrop div as clickable
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import cc from 'classcat'
import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { useSelector } from '../store'
import { clickedMenuBackdrop } from '../store/actions'
import Noop from './noop'
import TheSponsorMenu from './the-sponsor-menu'
import TheTilesMenu from './the-tiles-menu'

const TheMenuManager: React.FC = () => {
  const dispatch = useDispatch()
  const menu = useSelector((state) => state.ui.menu)

  const handleBgClick = useCallback(() => {
    dispatch(clickedMenuBackdrop())
  }, [dispatch])

  let Menu

  if (menu === 'sponsor') {
    Menu = TheSponsorMenu
  } else if (menu === 'tiles') {
    Menu = TheTilesMenu
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
