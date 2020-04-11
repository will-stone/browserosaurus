export interface Browser<Name = BrowserName> {
  name: Name
  appId: string
  hotKey?: string
  fav?: boolean
}

export const browserNames = [
  'Brave',
  'Brave Beta',
  'Brave Dev',
  'Chromium',
  'Cliqz',
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
  'Opera Beta',
  'Opera Developer',
  'Polypane',
  'qutebrowser',
  'Safari',
  'Safari Technology Preview',
  'Tor Browser',
  'Vivaldi',
  'Yandex',
] as const

export type BrowserName = typeof browserNames[number]

export interface BrowserProfile {
  browserName: string
  profile?: string
}

export type Browsers = { [key in BrowserName]: Browser<key> }

export const browsers: Browsers = {
  Brave: {
    name: 'Brave',
    appId: 'com.brave.Browser',
    hotKey: 'b',
  },
  'Brave Beta': {
    name: 'Brave Beta',
    appId: 'com.brave.Browser.beta',
  },
  'Brave Dev': {
    name: 'Brave Dev',
    appId: 'com.brave.Browser.dev',
  },
  Chromium: {
    name: 'Chromium',
    appId: 'org.chromium.Chromium',
    hotKey: 'c',
  },
  Cliqz: {
    name: 'Cliqz',
    appId: 'org.mozilla.cliqz',
    hotKey: 'z',
  },
  Firefox: {
    name: 'Firefox',
    appId: 'org.mozilla.firefox',
    hotKey: 'f',
  },
  'Firefox Developer Edition': {
    name: 'Firefox Developer Edition',
    appId: 'org.mozilla.firefoxdeveloperedition',
  },
  'Firefox Nightly': {
    name: 'Firefox Nightly',
    appId: 'org.mozilla.nightly',
  },
  'Google Chrome': {
    name: 'Google Chrome',
    appId: 'com.google.Chrome',
    hotKey: 'g',
  },
  'Google Chrome Canary': {
    name: 'Google Chrome Canary',
    appId: 'com.google.Chrome.canary',
  },
  Iridium: {
    name: 'Iridium',
    appId: 'de.iridiumbrowser',
    hotKey: 'i',
  },
  Maxthon: {
    name: 'Maxthon',
    appId: 'com.maxthon.mac.Maxthon',
    hotKey: 'm',
  },
  'Microsoft Edge': {
    name: 'Microsoft Edge',
    appId: 'com.microsoft.edgemac',
    hotKey: 'e',
  },
  'Microsoft Edge Beta': {
    name: 'Microsoft Edge Beta',
    appId: 'com.microsoft.edgemac.Beta',
  },
  'Microsoft Edge Canary': {
    name: 'Microsoft Edge Canary',
    appId: 'com.microsoft.edgemac.Canary',
  },
  'Microsoft Edge Dev': {
    name: 'Microsoft Edge Dev',
    appId: 'com.microsoft.edgemac.Dev',
  },
  Min: {
    name: 'Min',
    appId: 'com.electron.min',
    hotKey: '-',
  },
  Opera: {
    name: 'Opera',
    appId: 'com.operasoftware.Opera',
    hotKey: 'o',
  },
  'Opera Beta': {
    name: 'Opera Beta',
    appId: 'com.operasoftware.OperaNext',
  },
  'Opera Developer': {
    name: 'Opera Developer',
    appId: 'com.operasoftware.OperaDeveloper',
  },
  Polypane: {
    name: 'Polypane',
    appId: 'com.firstversionist.polypane',
    hotKey: 'p',
  },
  qutebrowser: {
    name: 'qutebrowser',
    appId: 'org.qt-project.Qt.QtWebEngineCore',
    hotKey: 'q',
  },
  Safari: {
    name: 'Safari',
    appId: 'com.apple.Safari',
    hotKey: 's',
  },
  'Safari Technology Preview': {
    name: 'Safari Technology Preview',
    appId: 'com.apple.SafariTechnologyPreview',
  },
  'Tor Browser': {
    name: 'Tor Browser',
    appId: 'org.torproject.torbrowser',
    hotKey: 't',
  },
  Vivaldi: {
    name: 'Vivaldi',
    appId: 'com.vivaldi.Vivaldi',
    hotKey: 'v',
  },
  Yandex: {
    name: 'Yandex',
    appId: 'ru.yandex.desktop.yandex-browser',
    hotKey: 'y',
  },
}
