import { spawn } from 'child_process'

import copyToClipboard from './copy-to-clipboard'

jest.mock('child_process')

test('should copy string', () => {
  copyToClipboard('string')
  expect(spawn).toHaveBeenCalledWith('sh', [
    '-c',
    'echo "string" | tr -d \'\n\' | pbcopy',
  ])
})
