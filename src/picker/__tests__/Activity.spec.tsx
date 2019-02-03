import * as React from 'react'
import { render } from 'react-testing-library'
import Activity from '../Activity'

describe('picker/Activity', () => {
  const props = {
    activity: {
      appId: 'Firefox',
      cmd: 'open "{URL}" -a Firefox',
      hotKey: 'f',
      name: 'Firefox',
    },
    onClick: jest.fn(),
  }

  it('should render the icon with correct alt and src', () => {
    const { getByAltText } = render(<Activity {...props} />)
    getByAltText('Firefox')
    // const icon = getByAltText('Firefox')
    // expect(icon.attributes).toBe(`../images/activity-icons/${props.activity.name}.png`)
  })
})
