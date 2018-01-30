import { css } from 'emotion'
import React from 'react'

import withBrowsersHOC from '../../shared/withBrowsersHOC'
import updateWindowHeight from '../../shared/updateWindowHeight'

class BrowsersTable extends React.Component {
  componentDidMount() {
    updateWindowHeight()
  }

  componentDidUpdate() {
    updateWindowHeight()
  }

  render() {
    console.log(this.props.browsers)
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
}

export default withBrowsersHOC(BrowsersTable)
