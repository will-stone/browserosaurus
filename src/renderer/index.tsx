import './index.css'

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { RecoilRoot } from 'recoil'

import App from './components/the-app'

ReactDOM.render(
  <RecoilRoot>
    <App />
  </RecoilRoot>,
  document.querySelector('#app'),
)
