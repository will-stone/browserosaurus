import { spawn } from 'child_process'
import { runCommand } from '../runCommand'

jest.mock('child_process')

describe('utils/runCommand', () => {
  it('should run string command', () => {
    runCommand('a command -g')
    expect(spawn).toHaveBeenCalledWith('sh', ['-c', 'a command -g'])
  })
})
