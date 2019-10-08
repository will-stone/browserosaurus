import braveBeta from '@browser-logos/brave-beta/brave-beta.svg'
import braveDev from '@browser-logos/brave-dev/brave-dev.svg'
import brave from '@browser-logos/brave/brave.svg'
import chromeCanary from '@browser-logos/chrome-canary/chrome-canary.svg'
import chrome from '@browser-logos/chrome/chrome.svg'
import chromium from '@browser-logos/chromium/chromium_256x256.png'
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
    appId: 'Brave',
    cmd: 'open "{URL}" -a "Brave Browser"',
    hotKey: 'b',
    logo: brave,
  },
  'Brave Beta': {
    name: 'Brave Beta',
    appId: 'Brave Browser Beta',
    cmd: 'open "{URL}" -a "Brave Browser Beta"',
    logo: braveBeta,
  },
  'Brave Dev': {
    name: 'Brave Dev',
    appId: 'Brave Browser Dev',
    cmd: 'open "{URL}" -a "Brave Browser Dev"',
    logo: braveDev,
  },
  Chromium: {
    name: 'Chromium',
    appId: 'Chromium',
    cmd: 'open "{URL}" -a Chromium',
    hotKey: 'c',
    logo: chromium,
  },
  Firefox: {
    name: 'Firefox',
    appId: 'Firefox',
    cmd: 'open "{URL}" -a Firefox',
    optCmd: 'open "{URL}" -a Firefox -g',
    hotKey: 'f',
    logo: firefox,
  },
  'Firefox Developer Edition': {
    name: 'Firefox Developer Edition',
    appId: 'Firefox Developer Edition',
    cmd: 'open "{URL}" -a "Firefox Developer Edition"',
    logo: firefoxDevEdition,
  },
  'Firefox Nightly': {
    name: 'Firefox Nightly',
    appId: 'Firefox Nightly',
    cmd: 'open "{URL}" -a "Firefox Nightly"',
    logo: firefoxNightly,
  },
  'Google Chrome': {
    name: 'Google Chrome',
    appId: 'Google Chrome',
    cmd: 'open "{URL}" -a "Google Chrome"',
    hotKey: 'g',
    logo: chrome,
  },
  'Google Chrome Canary': {
    name: 'Google Chrome Canary',
    appId: 'Google Chrome Canary',
    cmd: 'open "{URL}" -a "Google Chrome Canary"',
    logo: chromeCanary,
  },
  Iridium: {
    name: 'Iridium',
    appId: 'Iridium',
    cmd: 'open "{URL}" -a Iridium',
    hotKey: 'i',
    logo: iridium,
  },
  Maxthon: {
    name: 'Maxthon',
    appId: 'Maxthon',
    cmd: 'open "{URL}" -a Maxthon',
    hotKey: 'm',
    logo: maxthon,
  },
  'Microsoft Edge Dev': {
    name: 'Microsoft Edge Dev',
    appId: 'Microsoft Edge Dev',
    cmd: 'open "{URL}" -a "Microsoft Edge Dev"',
    hotKey: 'e',
    logo: edgeDev,
  },
  Min: {
    name: 'Min',
    appId: 'Min',
    cmd: 'open "{URL}" -a Min',
    hotKey: '-',
    logo: min,
  },
  Opera: {
    name: 'Opera',
    appId: 'Opera',
    cmd: 'open "{URL}" -a Opera',
    hotKey: 'o',
    logo: opera,
  },
  Polypane: {
    name: 'Polypane',
    appId: 'Polypane',
    cmd: 'open "{URL}" -a Polypane',
    hotKey: 'p',
    logo: polypane,
  },
  qutebrowser: {
    name: 'qutebrowser',
    appId: 'qutebrowser',
    cmd: 'open "{URL}" -a qutebrowser',
    hotKey: 'q',
    logo: qutebrowser,
  },
  Safari: {
    name: 'Safari',
    cmd: 'open "{URL}" -a Safari',
    optCmd: 'open "{URL}" -a Safari -g',
    hotKey: 's',
    logo: safari,
  },
  'Safari Technology Preview': {
    name: 'Safari Technology Preview',
    appId: 'Safari Technology Preview',
    cmd: 'open "{URL}" -a "Safari Technology Preview"',
    logo: safariTechnologyPreview,
  },
  'Tor Browser': {
    name: 'Tor Browser',
    appId: 'Tor Browser',
    cmd: 'open "{URL}" -a "Tor Browser"',
    optCmd: 'open "{URL}" -a "Tor Browser" -g',
    hotKey: 't',
    logo: tor,
  },
  Vivaldi: {
    name: 'Vivaldi',
    appId: 'Vivaldi',
    cmd: 'open "{URL}" -a Vivaldi',
    hotKey: 'v',
    logo: vivaldi,
  },
  Yandex: {
    name: 'Yandex',
    appId: 'Yandex',
    cmd: 'open "{URL}" -a Yandex',
    hotKey: 'y',
    logo: yandex,
  },
  'Copy To Clipboard': {
    name: 'Copy To Clipboard',
    cmd: 'echo "{URL}" | pbcopy',
    hotKey: 'space',
    logo: copyToClipboard,
  },
}
