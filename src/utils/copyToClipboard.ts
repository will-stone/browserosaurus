import { spawn } from 'child_process'

const copyToClipboard = (str: string) =>
  spawn('sh', ['-c', `echo "${str}" | tr -d '\n' | pbcopy`])

export default copyToClipboard
