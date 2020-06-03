import './index.css'

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { RecoilRoot } from 'recoil'

import TheApp from './components/the-app'

ReactDOM.render(
  <RecoilRoot>
    <TheApp />
  </RecoilRoot>,
  document.querySelector('#app'),
)
