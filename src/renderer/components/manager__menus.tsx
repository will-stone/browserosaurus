import React from 'react'

import { useSelector } from '../store'
import Noop from './atoms/noop'
import SponsorMenu from './menu__sponsor'
import TilesMenu from './menu__tiles'

const MenusManager: React.FC = () => {
  const menu = useSelector((state) => state.ui.menu)

  let Menu

  if (menu === 'sponsor') {
    Menu = SponsorMenu
  } else if (menu === 'tiles') {
    Menu = TilesMenu
  }

  if (Menu) {
    return <Menu />
  }

  return <Noop />
}

export default MenusManager
