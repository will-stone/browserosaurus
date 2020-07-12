import { spawn } from 'child_process'

import copyToClipboard from './copyToClipboard'

jest.mock('child_process')

test('should copy string', () => {
  copyToClipboard('string')
  expect(spawn).toHaveBeenCalledWith('sh', [
    '-c',
    'echo "string" | tr -d \'\n\' | pbcopy',
  ])
})
