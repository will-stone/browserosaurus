import React from 'react'
import { render } from 'react-testing-library'
import App from './app.component'

describe('Picker App', () => {
  const props = {
    isVisible: true,
    url: 'https://will-stone.github.io/browserosaurus/',
  }

  it('renders the URL', () => {
    const { queryByText } = render(<App {...props} />)
    const url = queryByText(props.url)
    expect(url.innerHTML).toBe(props.url)
  })
})
