import { ipcRenderer } from 'electron'
import { css } from 'emotion'
import React from 'react'

import Th from '../components/Th'
import Td from '../components/Td'

import updateWindowHeight from '../../shared/updateWindowHeight'

class BrowsersTable extends React.Component {
  componentDidMount() {
    updateWindowHeight()
  }

  componentDidUpdate() {
    updateWindowHeight()
  }

  /**
   * Toggle browser
   *
   * Sends the toggle-browser event to main.js. This enable/disables the
   * browser.
   * @param {string} browserName
   * @param {boolean} enabled
   */
  toggleBrowser(browserName, enabled) {
    ipcRenderer.send('toggle-browser', { browserName, enabled })
  }

  render() {
    const { browsers } = this.props

    return (
      <table
        className={css`
          width: 100%;
          border-collapse: collapse;
        `}
      >
        <thead>
          <tr>
            <Th>Browser</Th>
            <Th>Enabled</Th>
          </tr>
        </thead>
        <tbody>
          {browsers ? (
            browsers.map(browser => (
              <tr key={browser.name}>
                <Td>{browser.alias || browser.name}</Td>
                <Td>
                  <div className="pretty p-svg">
                    <input
                      type="checkbox"
                      checked={browser.enabled}
                      onChange={e => {
                        this.toggleBrowser(browser.name, e.target.checked)
                      }}
                    />
                    <div className="state p-success">
                      <svg className="svg svg-icon" viewBox="0 0 20 20">
                        <path
                          d="M7.629,14.566c0.125,0.125,0.291,0.188,0.456,0.188c0.164,0,0.329-0.062,0.456-0.188l8.219-8.221c0.252-0.252,0.252-0.659,0-0.911c-0.252-0.252-0.659-0.252-0.911,0l-7.764,7.763L4.152,9.267c-0.252-0.251-0.66-0.251-0.911,0c-0.252,0.252-0.252,0.66,0,0.911L7.629,14.566z"
                          style={{ stroke: 'white', fill: 'white' }}
                        />
                      </svg>
                      <label />
                    </div>
                  </div>
                </Td>
              </tr>
            ))
          ) : (
            <tr>
              <Td>Loading...</Td>
              <Td />
            </tr>
          )}
        </tbody>
      </table>
    )
  }
}

export default BrowsersTable
