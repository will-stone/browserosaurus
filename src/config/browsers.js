/**
 * The white-listed browsers.
 *
 * {
 *  AppName: {
 *   key: {string} - keyboard shortcut, single key.
 *                   Uses Mousetrap: https://craig.is/killing/mice
 *   alias: {string} - actual text shown in prefs and picker windows.
 *  }
 * }
 */

export default {
  Brave: { key: 'b' },
  Chromium: { key: 'c' },
  Firefox: { key: 'f' },
  'Firefox Developer Edition': { alias: 'Firefox Developer Edition', key: 'd' },
  FirefoxNightly: { alias: 'Nightly', key: 'n' },
  'Google Chrome': { key: 'g' },
  'Google Chrome Canary': { key: 'y' },
  Iridium: { key: 'i' },
  Maxthon: { key: 'm' },
  Min: { key: '-' },
  Opera: { key: 'o' },
  Safari: { key: 's' },
  TorBrowser: { key: 't' },
  Vivaldi: { key: 'v' }
}
