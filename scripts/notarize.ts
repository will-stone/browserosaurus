import { notarize } from 'electron-notarize'
import path from 'path'

notarize({
  appBundleId: 'com.browserosaurus',
  appPath: path.resolve(
    __dirname,
    '..',
    `out/Browserosaurus-darwin-x64/Browserosaurus.app`,
  ),
  appleId: String(process.env.APPLE_ID),
  appleIdPassword: '@keychain:AC_PASSWORD',
  ascProvider: 'Z89KPMLTFR',
}).catch((error) => {
  console.error(`Didn't work :( ${error.message}`) // eslint-disable-line no-console
})
