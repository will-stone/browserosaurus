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
import safariTechnologyPreview from '@browser-logos/safari-technology-preview/safari-technology-preview_256x256.png'
import safari from '@browser-logos/safari/safari_256x256.png'
import tor from '@browser-logos/tor/tor_256x256.png'
import vivaldi from '@browser-logos/vivaldi/vivaldi.svg'
import yandex from '@browser-logos/yandex/yandex_256x256.png'
import copyToClipboard from './copy-to-clipboard.png'
import min from './min_256x256.png'

export interface Activity<Name = WhiteListedActivityNames> {
  name: Name
  appId?: string
  hotKey?: string
  cmd: string
  fav?: boolean
}

export type WhiteListedActivityNames =
  | 'Brave Dev'
  | 'Brave Browser'
  | 'Chromium'
  | 'Firefox'
  | 'Firefox Developer Edition'
  | 'Firefox Nightly'
  | 'Google Chrome'
  | 'Google Chrome Canary'
  | 'Iridium'
  | 'Maxthon'
  | 'Microsoft Edge Dev'
  | 'Min'
  | 'Opera'
  | 'Safari'
  | 'Safari Technology Preview'
  | 'Tor Browser'
  | 'Vivaldi'
  | 'Yandex'
  | 'Copy To Clipboard'

export const logos: { [key in WhiteListedActivityNames]: string } = {
  'Brave Dev': braveDev,
  'Brave Browser': brave,
  Chromium: chromium,
  Firefox: firefox,
  'Firefox Developer Edition': firefoxDevEdition,
  'Firefox Nightly': firefoxNightly,
  'Google Chrome': chrome,
  'Google Chrome Canary': chromeCanary,
  Iridium: iridium,
  Maxthon: maxthon,
  'Microsoft Edge Dev': edgeDev,
  Min: min,
  Opera: opera,
  Safari: safari,
  'Safari Technology Preview': safariTechnologyPreview,
  'Tor Browser': tor,
  Vivaldi: vivaldi,
  Yandex: yandex,
  'Copy To Clipboard': copyToClipboard,
}

export type Activities = { [key in WhiteListedActivityNames]?: Activity<key> }

export const activities: Activities = {
  'Brave Dev': {
    name: 'Brave Dev',
    appId: 'Brave-Browser-Dev',
    cmd: 'open "{URL}" -a Brave-Browser-Dev',
  },
  'Brave Browser': {
    name: 'Brave Browser',
    appId: 'Brave Browser',
    cmd: 'open "{URL}" -a "Brave Browser"',
    hotKey: 'b',
  },
  Chromium: {
    name: 'Chromium',
    appId: 'Chromium',
    cmd: 'open "{URL}" -a Chromium',
    hotKey: 'c',
  },
  Firefox: {
    name: 'Firefox',
    appId: 'Firefox',
    cmd: 'open "{URL}" -a Firefox',
    hotKey: 'f',
  },
  'Firefox Developer Edition': {
    name: 'Firefox Developer Edition',
    appId: 'Firefox Developer Edition',
    cmd: 'open "{URL}" -a "Firefox Developer Edition"',
  },
  'Firefox Nightly': {
    name: 'Firefox Nightly',
    appId: 'Firefox Nightly',
    cmd: 'open "{URL}" -a "Firefox Nightly"',
  },
  'Google Chrome': {
    name: 'Google Chrome',
    appId: 'Google Chrome',
    cmd: 'open "{URL}" -a "Google Chrome"',
    hotKey: 'g',
  },
  'Google Chrome Canary': {
    name: 'Google Chrome Canary',
    appId: 'Google Chrome Canary',
    cmd: 'open "{URL}" -a "Google Chrome Canary"',
  },
  Iridium: {
    name: 'Iridium',
    appId: 'Iridium',
    cmd: 'open "{URL}" -a Iridium',
    hotKey: 'i',
  },
  Maxthon: {
    name: 'Maxthon',
    appId: 'Maxthon',
    cmd: 'open "{URL}" -a Maxthon',
    hotKey: 'm',
  },
  'Microsoft Edge Dev': {
    name: 'Microsoft Edge Dev',
    appId: 'Microsoft Edge Dev',
    cmd: 'open "{URL}" -a "Microsoft Edge Dev"',
    hotKey: 'e',
  },
  Min: {
    name: 'Min',
    appId: 'Min',
    cmd: 'open "{URL}" -a Min',
    hotKey: '-',
  },
  Opera: {
    name: 'Opera',
    appId: 'Opera',
    cmd: 'open "{URL}" -a Opera',
    hotKey: 'o',
  },
  Safari: {
    name: 'Safari',
    cmd: 'open "{URL}" -a Safari',
    hotKey: 's',
  },
  'Safari Technology Preview': {
    name: 'Safari Technology Preview',
    appId: 'Safari Technology Preview',
    cmd: 'open "{URL}" -a "Safari Technology Preview"',
  },
  'Tor Browser': {
    name: 'Tor Browser',
    appId: 'Tor Browser',
    cmd: 'open "{URL}" -a "Tor Browser"',
    hotKey: 't',
  },
  Vivaldi: {
    name: 'Vivaldi',
    appId: 'Vivaldi',
    cmd: 'open "{URL}" -a Vivaldi',
    hotKey: 'v',
  },
  Yandex: {
    name: 'Yandex',
    appId: 'Yandex',
    cmd: 'open "{URL}" -a Yandex',
    hotKey: 'y',
  },
  'Copy To Clipboard': {
    name: 'Copy To Clipboard',
    cmd: 'echo "{URL}" | pbcopy',
    hotKey: 'space',
  },
}
