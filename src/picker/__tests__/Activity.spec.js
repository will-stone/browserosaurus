import React from 'react'
import { render } from 'react-testing-library'
import Activity from '../Activity'

describe('picker/Activity', () => {
  const onClickSpy = jest.fn()

  const props = {
    activity: {
      name: 'Firefox',
      hotKey: 'f',
    },
    onClick: onClickSpy,
  }

  it('should render the icon with correct alt and src', () => {
    const { getByAltText } = render(<Activity {...props} />)
    const icon = getByAltText('Firefox')
    expect(icon.alt).toBe('Firefox')
    expect(icon.src).toBe(`../images/activity-icons/${props.activity.name}.png`)
  })
})
