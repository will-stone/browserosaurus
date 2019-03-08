import * as React from 'react'
import { render, waitForElement } from 'react-testing-library'
import { EAppState, Activity } from '../../model'
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
    state: EAppState.IDLE,
    url: 'https://will-stone.github.io/browserosaurus/',
  }

  it('should pass', () => {
    expect(true).toBeTruthy()
  })

  it('renders the URL', () => {
    const { getByText } = render(<App {...props} />)
    getByText(props.url)
  })

  it('renders the loading spinner', async () => {
    const { container } = render(<App {...props} />)
    await waitForElement(() => container.querySelector('.bp3-spinner'))
  })

  it('renders the activities list', async () => {
    const { state, ...restProps } = props
    const { getByAltText } = render(<App state={EAppState.FULFILLED} {...restProps} />)
    getByAltText('Firefox')
  })
})
