import { css } from 'emotion'
import React from 'react'

const BrowsersTable = () => {
  return (
    <table
      className={css`
        width: 100%;
        border-collapse: collapse;
      `}
    >
      <thead>
        <tr>
          <th>Browser</th>
          <th>Enabled</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Loading...</td>
        </tr>
      </tbody>
    </table>
  )
}

export default BrowsersTable
