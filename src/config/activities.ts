import braveBeta from '@browser-logos/brave-beta/brave-beta.svg'
import braveDev from '@browser-logos/brave-dev/brave-dev.svg'
import brave from '@browser-logos/brave/brave.svg'
import chromeCanary from '@browser-logos/chrome-canary/chrome-canary.svg'
import chrome from '@browser-logos/chrome/chrome.svg'
import chromium from '@browser-logos/chromium/chromium_256x256.png'
import edgeBeta from '@browser-logos/edge-beta/edge-beta.svg'
import edgeCanary from '@browser-logos/edge-canary/edge-canary.svg'
import edgeDev from '@browser-logos/edge-dev/edge-dev.svg'
import firefoxDevEdition from '@browser-logos/firefox-developer-edition/firefox-developer-edition.svg'
import firefoxNightly from '@browser-logos/firefox-nightly/firefox-nightly.svg'
import firefox from '@browser-logos/firefox/firefox.svg'
import iridium from '@browser-logos/iridium/iridium.svg'
import maxthon from '@browser-logos/maxthon/maxthon_256x256.png'
import opera from '@browser-logos/opera/opera.svg'
import qutebrowser from '@browser-logos/qutebrowser/qutebrowser.svg'
import safariTechnologyPreview from '@browser-logos/safari-technology-preview/safari-technology-preview_256x256.png'
import safari from '@browser-logos/safari/safari_256x256.png'
import tor from '@browser-logos/tor/tor_256x256.png'
import vivaldi from '@browser-logos/vivaldi/vivaldi.svg'
import yandex from '@browser-logos/yandex/yandex_256x256.png'
import copyToClipboard from './copy-to-clipboard.png'
import min from './min_256x256.png'
import polypane from './polypane_256x256.png'

export interface Activity<Name = ActivityName> {
  name: Name
  appId?: string
  hotKey?: string
  cmd: string
  optCmd?: string
  fav?: boolean
  logo: string
}

export const activityNames = [
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
  'Copy To Clipboard',
] as const

export type ActivityName = typeof activityNames[number]

export type Activities = { [key in ActivityName]: Activity<key> }

export const activities: Activities = {
  Brave: {
    name: 'Brave',
    appId: 'com.brave.Browser',
    cmd: 'open "{URL}" -b com.brave.Browser',
    hotKey: 'b',
    logo: brave,
  },
  'Brave Beta': {
    name: 'Brave Beta',
    appId: 'com.brave.Browser.beta',
    cmd: 'open "{URL}" -b com.brave.Browser.beta',
    logo: braveBeta,
  },
  'Brave Dev': {
    name: 'Brave Dev',
    appId: 'com.brave.Browser.dev',
    cmd: 'open "{URL}" -b com.brave.Browser.dev',
    logo: braveDev,
  },
  Chromium: {
    name: 'Chromium',
    appId: 'org.chromium.Chromium',
    cmd: 'open "{URL}" -b org.chromium.Chromium',
    hotKey: 'c',
    logo: chromium,
  },
  Firefox: {
    name: 'Firefox',
    appId: 'org.mozilla.firefox',
    cmd: 'open "{URL}" -b org.mozilla.firefox',
    optCmd: 'open "{URL}" -b org.mozilla.firefox -g',
    hotKey: 'f',
    logo: firefox,
  },
  'Firefox Developer Edition': {
    name: 'Firefox Developer Edition',
    appId: 'org.mozilla.firefoxdeveloperedition',
    cmd: 'open "{URL}" -b org.mozilla.firefoxdeveloperedition',
    logo: firefoxDevEdition,
  },
  'Firefox Nightly': {
    name: 'Firefox Nightly',
    appId: 'org.mozilla.nightly',
    cmd: 'open "{URL}" -b org.mozilla.nightly',
    logo: firefoxNightly,
  },
  'Google Chrome': {
    name: 'Google Chrome',
    appId: 'com.google.Chrome',
    cmd: 'open "{URL}" -b com.google.Chrome',
    hotKey: 'g',
    logo: chrome,
  },
  'Google Chrome Canary': {
    name: 'Google Chrome Canary',
    appId: 'com.google.Chrome.canary',
    cmd: 'open "{URL}" -b com.google.Chrome.canary',
    logo: chromeCanary,
  },
  Iridium: {
    name: 'Iridium',
    appId: 'de.iridiumbrowser',
    cmd: 'open "{URL}" -b de.iridiumbrowser',
    hotKey: 'i',
    logo: iridium,
  },
  Maxthon: {
    name: 'Maxthon',
    appId: 'com.maxthon.mac.Maxthon',
    cmd: 'open "{URL}" -b com.maxthon.mac.Maxthon',
    hotKey: 'm',
    logo: maxthon,
  },
  'Microsoft Edge Beta': {
    name: 'Microsoft Edge Beta',
    appId: 'com.microsoft.edgemac.Beta',
    cmd: 'open "{URL}" -b com.microsoft.edgemac.Beta',
    hotKey: 'e',
    logo: edgeBeta,
  },
  'Microsoft Edge Canary': {
    name: 'Microsoft Edge Canary',
    appId: 'com.microsoft.edgemac.Canary',
    cmd: 'open "{URL}" -b com.microsoft.edgemac.Canary',
    hotKey: 'e',
    logo: edgeCanary,
  },
  'Microsoft Edge Dev': {
    name: 'Microsoft Edge Dev',
    appId: 'com.microsoft.edgemac.Dev',
    cmd: 'open "{URL}" -b com.microsoft.edgemac.Dev',
    hotKey: 'e',
    logo: edgeDev,
  },
  Min: {
    name: 'Min',
    appId: 'com.electron.min',
    cmd: 'open "{URL}" -b com.electron.min',
    hotKey: '-',
    logo: min,
  },
  Opera: {
    name: 'Opera',
    appId: 'com.operasoftware.Opera',
    cmd: 'open "{URL}" -b com.operasoftware.Opera',
    hotKey: 'o',
    logo: opera,
  },
  Polypane: {
    name: 'Polypane',
    appId: 'com.firstversionist.polypane',
    cmd: 'open "{URL}" -b com.firstversionist.polypane',
    hotKey: 'p',
    logo: polypane,
  },
  qutebrowser: {
    name: 'qutebrowser',
    appId: 'org.qt-project.Qt.QtWebEngineCore',
    cmd: 'open "{URL}" -b org.qt-project.Qt.QtWebEngineCore',
    hotKey: 'q',
    logo: qutebrowser,
  },
  Safari: {
    name: 'Safari',
    appId: 'com.apple.Safari',
    cmd: 'open "{URL}" -b com.apple.Safari',
    optCmd: 'open "{URL}" -b com.apple.Safari -g',
    hotKey: 's',
    logo: safari,
  },
  'Safari Technology Preview': {
    name: 'Safari Technology Preview',
    appId: 'com.apple.SafariTechnologyPreview',
    cmd: 'open "{URL}" -b com.apple.SafariTechnologyPreview',
    logo: safariTechnologyPreview,
  },
  'Tor Browser': {
    name: 'Tor Browser',
    appId: 'org.torproject.torbrowser',
    cmd: 'open "{URL}" -b org.torproject.torbrowser',
    optCmd: 'open "{URL}" -b org.torproject.torbrowser -g',
    hotKey: 't',
    logo: tor,
  },
  Vivaldi: {
    name: 'Vivaldi',
    appId: 'com.vivaldi.Vivaldi',
    cmd: 'open "{URL}" -b com.vivaldi.Vivaldi',
    hotKey: 'v',
    logo: vivaldi,
  },
  Yandex: {
    name: 'Yandex',
    appId: 'ru.yandex.desktop.yandex-browser',
    cmd: 'open "{URL}" -b ru.yandex.desktop.yandex-browser',
    hotKey: 'y',
    logo: yandex,
  },
  'Copy To Clipboard': {
    name: 'Copy To Clipboard',
    cmd: 'echo "{URL}" | tr -d \'\n\' | pbcopy',
    hotKey: 'space',
    logo: copyToClipboard,
  },
}
