import * as execa from 'execa'

export const runCommand = (str: string) => execa.stdout('sh', ['-c', str])
