import { App } from '../../config/types'
import { doesAppExist } from '../doesAppExist'

const cases: [App, boolean][] = [
  [
    {
      name: 'Safari',
      id: 'com.apple.Safari',
    },
    true,
  ],
  [
    {
      name: 'Example',
      id: 'com.example',
    },
    false,
  ],
]

test.each(cases)('given %p return %p', (input, expected) => {
  return expect(doesAppExist(input)).resolves.toBe(expected)
})
