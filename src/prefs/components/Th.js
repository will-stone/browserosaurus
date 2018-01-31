import { css } from 'emotion'
import React from 'react'

const Th = ({ children, ...rest }) => {
  return (
    <th
      className={css`
        padding: 0.5rem;
        text-align: left;
      `}
      {...rest}
    >
      {children}
    </th>
  )
}

export default Th
