import React from 'react'
import { Provider } from 'react-redux'

import store from '../store'

const Bootstrap = (): JSX.Element => {
  return (
    <Provider store={store}>
      <div>hello</div>
    </Provider>
  )
}

export default Bootstrap
