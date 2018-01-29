import { css } from 'emotion'
import React from 'react'

const TitleBar = ({ children }) => {
  return (
    <div
      className={css`
        height: 2rem;
        -webkit-app-region: drag;
        text-align: center;
        line-height: 2rem;
      `}
    >
      {children}
    </div>
  )
}

export default TitleBar
