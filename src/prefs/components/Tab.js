import { css } from 'emotion'
import React from 'react'

const Tab = ({ active = false, component, ...rest }) => {
  const Component = component

  return (
    <div
      className={css`
        display: ${active ? 'block' : 'none'};
        padding: 1rem;
      `}
    >
      {active && <Component {...rest} />}
    </div>
  )
}

export default Tab
