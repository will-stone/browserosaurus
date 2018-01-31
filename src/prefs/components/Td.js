import { css } from 'emotion'
import React from 'react'

const Td = ({ children, ...rest }) => {
  return (
    <td
      className={css`
        padding: 0.5rem;
        text-align: left;
      `}
      {...rest}
    >
      {children}
    </td>
  )
}

export default Td
