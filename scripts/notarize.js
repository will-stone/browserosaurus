/* eslint-disable unicorn/no-process-exit */
/* eslint-disable no-console */
import { config } from 'dotenv'
import { notarize } from 'electron-notarize'
import path from 'path'

config()

const notarizeArch = (arch) =>
  notarize({
    tool: 'notarytool',
    appBundleId: 'com.browserosaurus',
    appPath: path.join(
      '.',
      'out',
      `Browserosaurus-darwin-${arch}64`,
      'Browserosaurus.app',
    ),
    keychain: '~/Library/Keychains/login.keychain-db',
    keychainProfile: 'AC_PASSWORD',
  })
    .then(() => {
      console.log(`Successfully notarized ${arch} :)`)
    })
    .catch((error) => {
      console.error("Notarization didn't work :(", error.message)
      process.exit(1)
    })

async function main() {
  await notarizeArch('arm')
  await notarizeArch('x')
}

main()
