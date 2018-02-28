import React from 'react'
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

const BrowserLink = ({ active, browser, onClick }) => {
  return (
    <Div
      key={browser.name}
      onClick={() => onClick(browser.name)}
      className={active && 'is-active'}
    >
      <BrowserLogoName name={browser.name} />
      <kbd className="pt-key pt-modifier-key" style={{ marginLeft: 'auto' }}>
        {browser.key}
      </kbd>
    </Div>
  )
}

export default BrowserLink
