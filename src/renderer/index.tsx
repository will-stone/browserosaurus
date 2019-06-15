import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from './App'
import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  * {
    user-select: none !important;
    box-sizing: border-box;
  }

  body {
    background-color: transparent;
    margin: 0;
    overflow: hidden;
  }

  html,
  body,
  #picker-root {
    height: 100%;
  }
`

ReactDOM.render(
  <>
    <GlobalStyle />
    <App />
  </>,
  document.getElementById('picker-root'),
)
