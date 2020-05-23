import './index.css'

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { RecoilRoot } from 'recoil'

import App from './App'

ReactDOM.render(
  <RecoilRoot>
    <App />
  </RecoilRoot>,
  document.querySelector('#app'),
)
