import { runCommand } from '../runCommand'
import * as execa from 'execa'

jest.mock('execa')

describe('utils/runCommand', () => {
  it('should run string command', () => {
    runCommand('a command -g')
    expect(execa.stdout).toHaveBeenCalledWith('sh', ['-c', 'a command -g'])
  })
})
