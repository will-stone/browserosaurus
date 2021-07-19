import { clipboard } from 'electron'

const copyToClipboard = (string: string): void => {
  clipboard.writeText(string)
}

export default copyToClipboard
