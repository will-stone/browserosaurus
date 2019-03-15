import * as React from 'react'
import { render } from 'react-testing-library'
import { Activity, EAppState } from '../../model'
import App from '../App'

const activities: Activity[] = [
  {
    appId: 'Firefox',
    cmd: 'open "{URL}" -a Firefox',
    hotKey: 'f',
    name: 'Firefox',
  },
]

describe('Picker App', () => {
  const props = {
    activities,
    isVisible: true,
    onActivityClick: jest.fn(),
    onCopyToClipboard: jest.fn(),
    onWindowAnimationEnd: jest.fn(),
    onWindowClick: jest.fn(),
    state: EAppState.IDLE,
    url: 'https://will-stone.github.io/browserosaurus/',
    fav: 'Firefox',
  }

  it('renders the URL', () => {
    const { getByText } = render(<App {...props} />)
    getByText(props.url)
  })

  it('renders the loading text', () => {
    const { getByText } = render(<App {...props} />)
    getByText('Loading...')
  })

  it('renders the activities list', () => {
    const { state, ...restProps } = props // eslint-disable-line @typescript-eslint/no-unused-vars
    const { getByAltText } = render(<App state={EAppState.FULFILLED} {...restProps} />)
    getByAltText('Firefox')
  })

  it('renders the hotkey', () => {
    const { state, ...restProps } = props // eslint-disable-line @typescript-eslint/no-unused-vars
    const { getByText } = render(<App state={EAppState.FULFILLED} {...restProps} />)
    getByText('f')
  })
})
