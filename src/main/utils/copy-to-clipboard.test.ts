import { clipboard } from 'electron'

import copyToClipboard from './copy-to-clipboard'

jest.mock('child_process')

test('should copy string', () => {
  copyToClipboard('string')
  expect(clipboard.readText()).toBe('string')
})
