import braveBeta from '@browser-logos/brave-beta/brave-beta.svg'
import braveDev from '@browser-logos/brave-dev/brave-dev.svg'
import brave from '@browser-logos/brave/brave.svg'
import chromeCanary from '@browser-logos/chrome-canary/chrome-canary.svg'
import chrome from '@browser-logos/chrome/chrome.svg'
import chromium from '@browser-logos/chromium/chromium_256x256.png'
import edgeBeta from '@browser-logos/edge-beta/edge-beta.svg'
import edgeCanary from '@browser-logos/edge-canary/edge-canary.svg'
import edgeDev from '@browser-logos/edge-dev/edge-dev.svg'
import edge from '@browser-logos/edge/edge.svg'
import firefoxDevEdition from '@browser-logos/firefox-developer-edition/firefox-developer-edition.svg'
import firefoxNightly from '@browser-logos/firefox-nightly/firefox-nightly.svg'
import firefox from '@browser-logos/firefox/firefox.svg'
import iridium from '@browser-logos/iridium/iridium.svg'
import maxthon from '@browser-logos/maxthon/maxthon_256x256.png'
import operaBeta from '@browser-logos/opera-beta/opera-beta_256x256.png'
import operaDeveloper from '@browser-logos/opera-developer/opera-developer_256x256.png'
import opera from '@browser-logos/opera/opera.svg'
import qutebrowser from '@browser-logos/qutebrowser/qutebrowser.svg'
import safariTechnologyPreview from '@browser-logos/safari-technology-preview/safari-technology-preview_256x256.png'
import safari from '@browser-logos/safari/safari_256x256.png'
import tor from '@browser-logos/tor/tor_256x256.png'
import vivaldi from '@browser-logos/vivaldi/vivaldi.svg'
import yandex from '@browser-logos/yandex/yandex_256x256.png'

import min from './min_256x256.png'
import pocket from './pocket.png'
import polypane from './polypane_256x256.png'

export interface Browser {
  name: string
  id: string
  logo: string
  urlTemplate?: string
}

export const browsers: Browser[] = [
  {
    name: 'Brave',
    id: 'com.brave.Browser',
    logo: brave,
  },
  {
    name: 'Brave Beta',
    id: 'com.brave.Browser.beta',
    logo: braveBeta,
  },
  {
    name: 'Brave Dev',
    id: 'com.brave.Browser.dev',
    logo: braveDev,
  },
  {
    name: 'Chromium',
    id: 'org.chromium.Chromium',
    logo: chromium,
  },
  {
    name: 'Firefox',
    id: 'org.mozilla.firefox',
    logo: firefox,
  },
  {
    name: 'Firefox Developer Edition',
    id: 'org.mozilla.firefoxdeveloperedition',
    logo: firefoxDevEdition,
  },
  {
    name: 'Firefox Nightly',
    id: 'org.mozilla.nightly',
    logo: firefoxNightly,
  },
  {
    name: 'Google Chrome',
    id: 'com.google.Chrome',
    logo: chrome,
  },
  {
    name: 'Google Chrome Canary',
    id: 'com.google.Chrome.canary',
    logo: chromeCanary,
  },
  {
    name: 'Iridium',
    id: 'de.iridiumbrowser',
    logo: iridium,
  },
  {
    name: 'Maxthon',
    id: 'com.maxthon.mac.Maxthon',
    logo: maxthon,
  },
  {
    name: 'Microsoft Edge',
    id: 'com.microsoft.edgemac',
    logo: edge,
  },
  {
    name: 'Microsoft Edge Beta',
    id: 'com.microsoft.edgemac.Beta',
    logo: edgeBeta,
  },
  {
    name: 'Microsoft Edge Canary',
    id: 'com.microsoft.edgemac.Canary',
    logo: edgeCanary,
  },
  {
    name: 'Microsoft Edge Dev',
    id: 'com.microsoft.edgemac.Dev',
    logo: edgeDev,
  },
  {
    name: 'Min',
    id: 'com.electron.min',
    logo: min,
  },
  {
    name: 'Opera',
    id: 'com.operasoftware.Opera',
    logo: opera,
  },
  {
    name: 'Opera Beta',
    id: 'com.operasoftware.OperaNext',
    logo: operaBeta,
  },
  {
    name: 'Opera Developer',
    id: 'com.operasoftware.OperaDeveloper',
    logo: operaDeveloper,
  },
  {
    name: 'Pocket',
    id: 'com.readitlater.PocketMac',
    logo: pocket,
    urlTemplate: 'pocket://add?url={{URL}}',
  },
  {
    name: 'Polypane',
    id: 'com.firstversionist.polypane',
    logo: polypane,
  },
  {
    name: 'qutebrowser',
    id: 'org.qt-project.Qt.QtWebEngineCore',
    logo: qutebrowser,
  },
  {
    name: 'Safari',
    id: 'com.apple.Safari',
    logo: safari,
  },
  {
    name: 'Safari Technology Preview',
    id: 'com.apple.SafariTechnologyPreview',
    logo: safariTechnologyPreview,
  },
  {
    name: 'Tor Browser',
    id: 'org.torproject.torbrowser',
    logo: tor,
  },
  {
    name: 'Vivaldi',
    id: 'com.vivaldi.Vivaldi',
    logo: vivaldi,
  },
  {
    name: 'Yandex',
    id: 'ru.yandex.desktop.yandex-browser',
    logo: yandex,
  },
]
