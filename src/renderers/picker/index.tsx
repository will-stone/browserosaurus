import '../shared/index.css'

import { createRoot } from 'react-dom/client'

import Bootstrap from './components/_bootstrap'

const container = document.querySelector('#root')

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!)

root.render(<Bootstrap />)
