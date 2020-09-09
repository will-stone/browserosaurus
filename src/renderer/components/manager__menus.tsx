import { Transition } from '@tailwindui/react'
import React from 'react'

import { useSelector } from '../store'
import TilesMenu from './menu__tiles'

const MenusManager: React.FC = () => {
  const menu = useSelector((state) => state.ui.menu)

  return (
    <Transition
      enter="transition-opacity duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-150"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
      show={menu === 'tiles'}
    >
      <TilesMenu />
    </Transition>
  )
}

export default MenusManager
