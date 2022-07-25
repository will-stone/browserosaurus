import { Provider } from 'react-redux'

import store from '../state/store'
import App from './layout'

const Bootstrap: React.FC = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  )
}

export default Bootstrap
