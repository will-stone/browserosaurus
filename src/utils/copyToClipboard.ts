import { spawn } from 'child_process'

const copyToClipboard = (string: string) =>
  spawn('sh', ['-c', `echo "${string}" | tr -d '\n' | pbcopy`])

export default copyToClipboard
