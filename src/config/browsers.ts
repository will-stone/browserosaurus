export interface Browser<Name = BrowserName> {
  name: Name
  appId?: string
  hotKey?: string
  cmd: string
  optCmd?: string
  fav?: boolean
}

export const browserNames = [
  'Brave',
  'Brave Beta',
  'Brave Dev',
  'Chromium',
  'Firefox',
  'Firefox Developer Edition',
  'Firefox Nightly',
  'Google Chrome',
  'Google Chrome Canary',
  'Iridium',
  'Maxthon',
  'Microsoft Edge',
  'Microsoft Edge Beta',
  'Microsoft Edge Canary',
  'Microsoft Edge Dev',
  'Min',
  'Opera',
  'Polypane',
  'qutebrowser',
  'Safari',
  'Safari Technology Preview',
  'Tor Browser',
  'Vivaldi',
  'Yandex',
] as const

export type BrowserName = typeof browserNames[number]

export type Browsers = { [key in BrowserName]: Browser<key> }

export const browsers: Browsers = {
  Brave: {
    name: 'Brave',
    appId: 'com.brave.Browser',
    cmd: 'open "{URL}" -b com.brave.Browser',
    hotKey: 'b',
  },
  'Brave Beta': {
    name: 'Brave Beta',
    appId: 'com.brave.Browser.beta',
    cmd: 'open "{URL}" -b com.brave.Browser.beta',
  },
  'Brave Dev': {
    name: 'Brave Dev',
    appId: 'com.brave.Browser.dev',
    cmd: 'open "{URL}" -b com.brave.Browser.dev',
  },
  Chromium: {
    name: 'Chromium',
    appId: 'org.chromium.Chromium',
    cmd: 'open "{URL}" -b org.chromium.Chromium',
    hotKey: 'c',
  },
  Firefox: {
    name: 'Firefox',
    appId: 'org.mozilla.firefox',
    cmd: 'open "{URL}" -b org.mozilla.firefox',
    optCmd: 'open "{URL}" -b org.mozilla.firefox -g',
    hotKey: 'f',
  },
  'Firefox Developer Edition': {
    name: 'Firefox Developer Edition',
    appId: 'org.mozilla.firefoxdeveloperedition',
    cmd: 'open "{URL}" -b org.mozilla.firefoxdeveloperedition',
  },
  'Firefox Nightly': {
    name: 'Firefox Nightly',
    appId: 'org.mozilla.nightly',
    cmd: 'open "{URL}" -b org.mozilla.nightly',
  },
  'Google Chrome': {
    name: 'Google Chrome',
    appId: 'com.google.Chrome',
    cmd: 'open "{URL}" -b com.google.Chrome',
    hotKey: 'g',
  },
  'Google Chrome Canary': {
    name: 'Google Chrome Canary',
    appId: 'com.google.Chrome.canary',
    cmd: 'open "{URL}" -b com.google.Chrome.canary',
  },
  Iridium: {
    name: 'Iridium',
    appId: 'de.iridiumbrowser',
    cmd: 'open "{URL}" -b de.iridiumbrowser',
    hotKey: 'i',
  },
  Maxthon: {
    name: 'Maxthon',
    appId: 'com.maxthon.mac.Maxthon',
    cmd: 'open "{URL}" -b com.maxthon.mac.Maxthon',
    hotKey: 'm',
  },
  'Microsoft Edge': {
    name: 'Microsoft Edge',
    appId: 'com.microsoft.edgemac',
    cmd: 'open "{URL}" -b com.microsoft.edgemac',
    hotKey: 'e',
  },
  'Microsoft Edge Beta': {
    name: 'Microsoft Edge Beta',
    appId: 'com.microsoft.edgemac.Beta',
    cmd: 'open "{URL}" -b com.microsoft.edgemac.Beta',
  },
  'Microsoft Edge Canary': {
    name: 'Microsoft Edge Canary',
    appId: 'com.microsoft.edgemac.Canary',
    cmd: 'open "{URL}" -b com.microsoft.edgemac.Canary',
  },
  'Microsoft Edge Dev': {
    name: 'Microsoft Edge Dev',
    appId: 'com.microsoft.edgemac.Dev',
    cmd: 'open "{URL}" -b com.microsoft.edgemac.Dev',
  },
  Min: {
    name: 'Min',
    appId: 'com.electron.min',
    cmd: 'open "{URL}" -b com.electron.min',
    hotKey: '-',
  },
  Opera: {
    name: 'Opera',
    appId: 'com.operasoftware.Opera',
    cmd: 'open "{URL}" -b com.operasoftware.Opera',
    hotKey: 'o',
  },
  Polypane: {
    name: 'Polypane',
    appId: 'com.firstversionist.polypane',
    cmd: 'open "{URL}" -b com.firstversionist.polypane',
    hotKey: 'p',
  },
  qutebrowser: {
    name: 'qutebrowser',
    appId: 'org.qt-project.Qt.QtWebEngineCore',
    cmd: 'open "{URL}" -b org.qt-project.Qt.QtWebEngineCore',
    hotKey: 'q',
  },
  Safari: {
    name: 'Safari',
    appId: 'com.apple.Safari',
    cmd: 'open "{URL}" -b com.apple.Safari',
    optCmd: 'open "{URL}" -b com.apple.Safari -g',
    hotKey: 's',
  },
  'Safari Technology Preview': {
    name: 'Safari Technology Preview',
    appId: 'com.apple.SafariTechnologyPreview',
    cmd: 'open "{URL}" -b com.apple.SafariTechnologyPreview',
  },
  'Tor Browser': {
    name: 'Tor Browser',
    appId: 'org.torproject.torbrowser',
    cmd: 'open "{URL}" -b org.torproject.torbrowser',
    optCmd: 'open "{URL}" -b org.torproject.torbrowser -g',
    hotKey: 't',
  },
  Vivaldi: {
    name: 'Vivaldi',
    appId: 'com.vivaldi.Vivaldi',
    cmd: 'open "{URL}" -b com.vivaldi.Vivaldi',
    hotKey: 'v',
  },
  Yandex: {
    name: 'Yandex',
    appId: 'ru.yandex.desktop.yandex-browser',
    cmd: 'open "{URL}" -b ru.yandex.desktop.yandex-browser',
    hotKey: 'y',
  },
}
