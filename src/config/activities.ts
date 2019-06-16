import { Activity } from '../model'
import braveDev from 'browser-logos/src/brave-dev/brave-dev_256x256.png'
import brave from 'browser-logos/src/brave/brave_256x256.png'
import copyToClipboard from './copy-to-clipboard.png'
import chromium from 'browser-logos/src/chromium/chromium_256x256.png'
import edgeDev from 'browser-logos/src/edge-dev/edge-dev_256x256.png'
import firefox from 'browser-logos/src/firefox/firefox_256x256.png'
import firefoxDevEdition from 'browser-logos/src/firefox-developer-edition/firefox-developer-edition_256x256.png'
import firefoxNightly from 'browser-logos/src/firefox-nightly/firefox-nightly_256x256.png'
import googleChrome from 'browser-logos/src/chrome/chrome_256x256.png'
import googleChromeCanary from 'browser-logos/src/chrome-canary/chrome-canary_256x256.png'
import iridium from 'browser-logos/src/iridium/iridium_256x256.png'
import maxthon from 'browser-logos/src/maxthon/maxthon_256x256.png'
import min from 'browser-logos/src/min/min_256x256.png'
import opera from 'browser-logos/src/opera/opera_256x256.png'
import safari from 'browser-logos/src/safari/safari_256x256.png'
import safariTechnologyPreview from 'browser-logos/src/safari-technology-preview/safari-technology-preview_256x256.png'
import tor from 'browser-logos/src/tor/tor_256x256.png'
import vivaldi from 'browser-logos/src/vivaldi/vivaldi_256x256.png'

export const activities: Activity[] = [
  {
    appId: 'Brave-Browser-Dev',
    cmd: 'open "{URL}" -a Brave-Browser-Dev',
    hotKey: 'r',
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
    hotKey: 'd',
    name: 'Firefox Developer Edition',
    logo: firefoxDevEdition,
  },
  {
    appId: 'Firefox Nightly',
    cmd: 'open "{URL}" -a "Firefox Nightly"',
    hotKey: 'n',
    name: 'Firefox Nightly',
    logo: firefoxNightly,
  },
  {
    appId: 'Google Chrome',
    cmd: 'open "{URL}" -a "Google Chrome"',
    hotKey: 'g',
    name: 'Google Chrome',
    logo: googleChrome,
  },
  {
    appId: 'Google Chrome Canary',
    cmd: 'open "{URL}" -a "Google Chrome Canary"',
    hotKey: 'y',
    name: 'Google Chrome Canary',
    logo: googleChromeCanary,
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
    hotKey: 'p',
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
]
