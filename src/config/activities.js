/**
 * Activities
 *
 */

export default [
  {
    appId: 'Brave',
    name: 'Brave',
    hotKey: 'b',
    cmd: 'open "{URL}" -a Brave',
  },
  {
    appId: 'Brave-Browser-Dev',
    name: 'Brave Dev',
    hotKey: 'r',
    cmd: 'open "{URL}" -a Brave-Browser-Dev',
  },
  {
    appId: 'Chromium',
    name: 'Chromium',
    hotKey: 'c',
    cmd: 'open "{URL}" -a Chromium',
  },
  {
    appId: 'Firefox',
    name: 'Firefox',
    hotKey: 'f',
    cmd: 'open "{URL}" -a Firefox',
  },
  {
    appId: 'Firefox Developer Edition',
    name: 'Firefox Developer Edition',
    hotKey: 'd',
    cmd: 'open "{URL}" -a "Firefox Developer Edition"',
  },
  {
    appId: 'Firefox Nightly',
    name: 'Firefox Nightly',
    hotKey: 'n',
    cmd: 'open "{URL}" -a "Firefox Nightly"',
  },
  {
    appId: 'Google Chrome',
    name: 'Google Chrome',
    hotKey: 'g',
    cmd: 'open "{URL}" -a "Google Chrome"',
  },
  {
    appId: 'Google Chrome Canary',
    name: 'Google Chrome Canary',
    hotKey: 'y',
    cmd: 'open "{URL}" -a "Google Chrome Canary"',
  },
  {
    appId: 'Iridium',
    name: 'Iridium',
    hotKey: 'i',
    cmd: 'open "{URL}" -a Iridium',
  },
  {
    appId: 'Maxthon',
    name: 'Maxthon',
    hotKey: 'm',
    cmd: 'open "{URL}" -a Maxthon',
  },
  {
    appId: 'Min',
    name: 'Min',
    hotKey: '-',
    cmd: 'open "{URL}" -a Min',
  },
  {
    appId: 'Opera',
    name: 'Opera',
    hotKey: 'o',
    cmd: 'open "{URL}" -a Opera',
  },
  {
    name: 'Safari',
    hotKey: 's',
    cmd: 'open "{URL}" -a Safari',
  },
  {
    name: 'Safari Technology Preview',
    hotKey: 'p',
    cmd: 'open "{URL}" -a "Safari Technology Preview"',
  },
  {
    appId: 'TorBrowser',
    name: 'TorBrowser',
    hotKey: 't',
    cmd: 'open "{URL}" -a TorBrowser',
  },
  {
    appId: 'Vivaldi',
    name: 'Vivaldi',
    hotKey: 'v',
    cmd: 'open "{URL}" -a Vivaldi',
  },
  {
    name: 'Copy To Clipboard',
    hotKey: 'space',
    cmd: 'echo "{URL}" | pbcopy',
  },
]
