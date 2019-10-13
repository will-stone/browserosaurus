import { spawn } from 'child_process'

export const copyToClipboard = (str: string) =>
  spawn('sh', ['-c', `echo "${str}" | tr -d '\n' | pbcopy`])
