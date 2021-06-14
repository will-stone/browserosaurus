import React from 'react'
import { Provider } from 'react-redux'

import store from '../store'
import Layout from './layout'

const Bootstrap = (): JSX.Element => {
  return (
    <Provider store={store}>
      <Layout />
    </Provider>
  )
}

export default Bootstrap
