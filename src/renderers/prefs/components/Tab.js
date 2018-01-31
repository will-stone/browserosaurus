import { css } from 'emotion'
import React from 'react'

const Tab = ({ active = false, component, ...rest }) => {
  if (active) {
    const Component = component
    return (
      <div
        className={css`
          display: block;
          padding: 1rem;
        `}
      >
        <Component {...rest} />
      </div>
    )
  } else {
    return null
  }
}

export default Tab
