import * as execa from 'execa'

const runCommand = (str: string) => execa.stdout('sh', ['-c', str])

export default runCommand
