import { css } from 'emotion'
import React from 'react'

import NavBarButton from './NavBarButton'

const NavBar = ({ activeTabId, children, onTabButtonClick }) => {
  return (
    <ul
      className={css`
        display: flex;
        justify-content: space-around;
        height: 64px;
        margin: 0;
        padding: 0;
        list-style: none;
        border-bottom: 1px solid #111111;
        line-height: 64px;
      `}
    >
      <NavBarButton
        active={activeTabId === 0}
        id={0}
        onClick={onTabButtonClick}
      >
        Browsers
      </NavBarButton>
      <NavBarButton
        active={activeTabId === 1}
        id={1}
        onClick={onTabButtonClick}
      >
        About
      </NavBarButton>
    </ul>
  )
}

export default NavBar
