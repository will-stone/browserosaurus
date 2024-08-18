import { Provider } from 'react-redux'

import store from '../state/store'
import Layout from './layout'

const Bootstrap = (): JSX.Element => {
  return (
    <Provider store={store}>
      <Layout />
    </Provider>
  )
}

export default Bootstrap
