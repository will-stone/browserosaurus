import * as execa from 'execa'

import runCommand from '../runCommand'

jest.mock('execa')

describe('utils/runCommand', () => {
  it('should run string command', () => {
    runCommand('a command -g')
    expect(execa.stdout).toHaveBeenCalledWith('sh', ['-c', 'a command -g'])
  })
})
