/* eslint-disable unicorn/no-process-exit */
/* eslint-disable no-console */
const { notarize } = require('electron-notarize')
const path = require('path')

const notarizeArch = (arch) =>
  notarize({
    appBundleId: 'com.browserosaurus',
    appPath: path.join(
      '.',
      'out',
      `Browserosaurus-darwin-${arch}64`,
      'Browserosaurus.app',
    ),
    keychain: '~/Library/Keychains/login.keychain-db',
    keychainProfile: 'AC_PASSWORD',
    tool: 'notarytool',
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
