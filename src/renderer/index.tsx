import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { createGlobalStyle } from 'styled-components'

import App from './App'

const GlobalStyle = createGlobalStyle`
  * {
    user-select: none !important;
    box-sizing: border-box;
  }

  body {
    background-color: transparent;
    margin: 0;
    overflow: hidden;
    font-family: 
      -apple-system,
      system-ui,
      BlinkMacSystemFont,
      'Segoe UI',
      Roboto,
      'Helvetica Neue',
      Arial,
      sans-serif;
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
