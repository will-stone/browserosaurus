import React from 'react'
import { render } from 'react-testing-library'
import Activity from './activity.component'

describe('Activity', () => {
  const props = {
    activity: {
      name: 'Firefox',
      hotKey: 'f',
    },
  }

  it('renders the icon with correct alt and src', () => {
    const { getByAltText } = render(<Activity {...props} />)
    const icon = getByAltText('activity')
    expect(icon.alt).toBe('activity')
    expect(icon.src).toBe(`../images/activity-icons/${props.activity.name}.png`)
  })
})
