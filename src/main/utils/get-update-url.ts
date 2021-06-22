import { app } from 'electron'

export function getUpdateUrl(): string {
  return `https://update.electronjs.org/will-stone/browserosaurus/darwin-${
    process.arch
  }/${app.getVersion()}`
}
