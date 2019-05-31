import { notarize } from 'electron-notarize'

notarize({
  appBundleId: 'com.browserosaurus',
  appPath: __dirname + '/out/Browserosaurus-darwin-x64/Browserosaurus.app',
  appleId: String(process.env.APPLE_ID),
  appleIdPassword: `@keychain:AC_PASSWORD`,
  ascProvider: 'Z89KPMLTFR',
}).catch(e => {
  console.error("Didn't work :( " + e.message) // eslint-disable-line no-console
})
