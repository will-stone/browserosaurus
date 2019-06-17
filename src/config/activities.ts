import { Activity } from '../model'
import brave from '@browser-logos/brave/brave.svg'
import braveDev from '@browser-logos/brave-dev/brave-dev.svg'
import chrome from '@browser-logos/chrome/chrome.svg'
import chromeCanary from '@browser-logos/chrome-canary/chrome-canary.svg'
import chromium from '@browser-logos/chromium/chromium_256x256.png'
import copyToClipboard from './copy-to-clipboard.png'
import edgeDev from '@browser-logos/edge-dev/edge-dev.svg'
import firefox from '@browser-logos/firefox/firefox.svg'
import firefoxDevEdition from '@browser-logos/firefox-developer-edition/firefox-developer-edition.svg'
import firefoxNightly from '@browser-logos/firefox-nightly/firefox-nightly.svg'
import iridium from '@browser-logos/iridium/iridium.svg'
import maxthon from '@browser-logos/maxthon/maxthon_256x256.png'
import min from './min_256x256.png'
import opera from '@browser-logos/opera/opera.svg'
import safari from '@browser-logos/safari/safari_256x256.png'
import safariTechnologyPreview from '@browser-logos/safari-technology-preview/safari-technology-preview_256x256.png'
import tor from '@browser-logos/tor/tor_256x256.png'
import vivaldi from '@browser-logos/vivaldi/vivaldi.svg'
import yandex from '@browser-logos/yandex/yandex_256x256.png'

export const activities: Activity[] = [
  {
    appId: 'Brave-Browser-Dev',
    cmd: 'open "{URL}" -a Brave-Browser-Dev',
    name: 'Brave Dev',
    logo: braveDev,
  },
  {
    appId: 'Brave Browser',
    cmd: 'open "{URL}" -a "Brave Browser"',
    hotKey: 'b',
    name: 'Brave Browser',
    logo: brave,
  },
  {
    appId: 'Chromium',
    cmd: 'open "{URL}" -a Chromium',
    hotKey: 'c',
    name: 'Chromium',
    logo: chromium,
  },
  {
    cmd: 'echo "{URL}" | pbcopy',
    hotKey: 'space',
    name: 'Copy To Clipboard',
    logo: copyToClipboard,
  },
  {
    appId: 'Firefox',
    cmd: 'open "{URL}" -a Firefox',
    hotKey: 'f',
    name: 'Firefox',
    logo: firefox,
  },
  {
    appId: 'Firefox Developer Edition',
    cmd: 'open "{URL}" -a "Firefox Developer Edition"',
    name: 'Firefox Developer Edition',
    logo: firefoxDevEdition,
  },
  {
    appId: 'Firefox Nightly',
    cmd: 'open "{URL}" -a "Firefox Nightly"',
    name: 'Firefox Nightly',
    logo: firefoxNightly,
  },
  {
    appId: 'Google Chrome',
    cmd: 'open "{URL}" -a "Google Chrome"',
    hotKey: 'g',
    name: 'Google Chrome',
    logo: chrome,
  },
  {
    appId: 'Google Chrome Canary',
    cmd: 'open "{URL}" -a "Google Chrome Canary"',
    name: 'Google Chrome Canary',
    logo: chromeCanary,
  },
  {
    appId: 'Iridium',
    cmd: 'open "{URL}" -a Iridium',
    hotKey: 'i',
    name: 'Iridium',
    logo: iridium,
  },
  {
    appId: 'Maxthon',
    cmd: 'open "{URL}" -a Maxthon',
    hotKey: 'm',
    name: 'Maxthon',
    logo: maxthon,
  },
  {
    appId: 'Microsoft Edge Dev',
    cmd: 'open "{URL}" -a "Microsoft Edge Dev"',
    hotKey: 'e',
    name: 'Microsoft Edge Dev',
    logo: edgeDev,
  },
  {
    appId: 'Min',
    cmd: 'open "{URL}" -a Min',
    hotKey: '-',
    name: 'Min',
    logo: min,
  },
  {
    appId: 'Opera',
    cmd: 'open "{URL}" -a Opera',
    hotKey: 'o',
    name: 'Opera',
    logo: opera,
  },
  {
    cmd: 'open "{URL}" -a Safari',
    hotKey: 's',
    name: 'Safari',
    logo: safari,
  },
  {
    appId: 'Safari Technology Preview',
    cmd: 'open "{URL}" -a "Safari Technology Preview"',
    name: 'Safari Technology Preview',
    logo: safariTechnologyPreview,
  },
  {
    appId: 'Tor Browser',
    cmd: 'open "{URL}" -a "Tor Browser"',
    hotKey: 't',
    name: 'Tor Browser',
    logo: tor,
  },
  {
    appId: 'Vivaldi',
    cmd: 'open "{URL}" -a Vivaldi',
    hotKey: 'v',
    name: 'Vivaldi',
    logo: vivaldi,
  },
  {
    appId: 'Yandex',
    cmd: 'open "{URL}" -a Yandex',
    hotKey: 'y',
    name: 'Yandex',
    logo: yandex,
  },
]
