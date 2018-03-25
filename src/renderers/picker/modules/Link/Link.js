import React, { Fragment } from 'react'
import styled from 'styled-components'

import BrowserLogoName from '../../../components/BrowserLogoName'

const Div = styled.div`
  padding: 1rem 1rem 1rem 0;
  display: flex;
  align-items: center;

  &:hover,
  &.is-active {
    background-color: #0d8050;
  }
`

const BrowserLink = ({ active, browser, defaultBrowser, onClick }) => {
  return (
    <Div
      // key={browser.name}
      onClick={() => onClick(browser.name)}
      className={active && 'is-active'}
    >
      <BrowserLogoName name={browser.name} />

      <span>
        {defaultBrowser && (
          <Fragment>
            <kbd className="pt-key">enter</kbd>
            <span style={{ margin: '0 0.5rem' }} className="pt-text-muted">
              /
            </span>
          </Fragment>
        )}

        <kbd className="pt-key" style={{ marginLeft: 'auto' }}>
          {browser.hotKey}
        </kbd>
      </span>
    </Div>
  )
}

export default BrowserLink
