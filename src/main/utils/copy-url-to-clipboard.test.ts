import { clipboard } from 'electron'

import copyUrlToClipboard from './copy-url-to-clipboard'

jest.mock('child_process')

test('should copy string', () => {
  copyUrlToClipboard('string')
  expect(clipboard.readText()).toBe('string')
})

test.todo('should show notification')
