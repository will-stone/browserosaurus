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

import { BrowserName } from './browsers'
import cliqz from './cliqz.svg'
import min from './min_256x256.png'
import polypane from './polypane_256x256.png'

type Browsers = { [key in BrowserName]: string }

const browserLogos: Browsers = {
  Brave: brave,
  'Brave Beta': braveBeta,
  'Brave Dev': braveDev,
  Chromium: chromium,
  Cliqz: cliqz,
  Firefox: firefox,
  'Firefox Developer Edition': firefoxDevEdition,
  'Firefox Nightly': firefoxNightly,
  'Google Chrome': chrome,
  'Google Chrome Canary': chromeCanary,
  Iridium: iridium,
  Maxthon: maxthon,
  'Microsoft Edge': edge,
  'Microsoft Edge Beta': edgeBeta,
  'Microsoft Edge Canary': edgeCanary,
  'Microsoft Edge Dev': edgeDev,
  Min: min,
  Opera: opera,
  'Opera Beta': operaBeta,
  'Opera Developer': operaDeveloper,
  Polypane: polypane,
  qutebrowser,
  Safari: safari,
  'Safari Technology Preview': safariTechnologyPreview,
  'Tor Browser': tor,
  Vivaldi: vivaldi,
  Yandex: yandex,
}

export default browserLogos
