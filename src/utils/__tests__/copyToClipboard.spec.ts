import { spawn } from 'child_process'
import { copyToClipboard } from '../copyToClipboard'

jest.mock('child_process')

describe('utils/copyToClipboard', () => {
  it('should copy string', () => {
    copyToClipboard('string')
    expect(spawn).toHaveBeenCalledWith('sh', ['-c', 'echo "string" | pbcopy'])
  })
})
