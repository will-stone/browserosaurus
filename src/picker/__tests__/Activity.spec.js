import React from 'react'
import { render } from 'react-testing-library'
import Activity from '../Activity'

describe('Activity', () => {
  const props = {
    activity: {
      name: 'Firefox',
      hotKey: 'f',
    },
  }

  it('renders the icon with correct alt and src', () => {
    const { getByAltText } = render(<Activity {...props} />)
    const icon = getByAltText('Firefox')
    expect(icon.alt).toBe('Firefox')
    expect(icon.src).toBe(`../images/activity-icons/${props.activity.name}.png`)
  })
})
