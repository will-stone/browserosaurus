import { spawn } from 'child_process'

export const runCommand = (str: string) => spawn('sh', ['-c', str])
