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
import operaGX from '@browser-logos/opera-gx/opera-gx.svg'
import opera from '@browser-logos/opera/opera.svg'
import qutebrowser from '@browser-logos/qutebrowser/qutebrowser.svg'
import safariTechnologyPreview from '@browser-logos/safari-technology-preview/safari-technology-preview_256x256.png'
import safari from '@browser-logos/safari/safari_256x256.png'
import tor from '@browser-logos/tor/tor_256x256.png'
import vivaldiSnapshot from '@browser-logos/vivaldi-snapshot/vivaldi-snapshot_256x256.png'
import vivaldi from '@browser-logos/vivaldi/vivaldi.svg'
import yandex from '@browser-logos/yandex/yandex_256x256.png'

import min from './min_256x256.png'
import pocket from './pocket.png'
import polypane from './polypane_256x256.png'

export const logos: { [key: string]: string } = {
  'com.brave.Browser': brave,
  'com.brave.Browser.beta': braveBeta,
  'com.brave.Browser.dev': braveDev,
  'org.chromium.Chromium': chromium,
  'org.mozilla.firefox': firefox,
  'org.mozilla.firefoxdeveloperedition': firefoxDevEdition,
  'org.mozilla.nightly': firefoxNightly,
  'com.google.Chrome': chrome,
  'com.google.Chrome.canary': chromeCanary,
  'de.iridiumbrowser': iridium,
  'com.maxthon.mac.Maxthon': maxthon,
  'com.microsoft.edgemac': edge,
  'com.microsoft.edgemac.Beta': edgeBeta,
  'com.microsoft.edgemac.Canary': edgeCanary,
  'com.microsoft.edgemac.Dev': edgeDev,
  'com.electron.min': min,
  'com.operasoftware.Opera': opera,
  'com.operasoftware.OperaGX': operaGX,
  'com.operasoftware.OperaNext': operaBeta,
  'com.operasoftware.OperaDeveloper': operaDeveloper,
  'com.readitlater.PocketMac': pocket,
  'com.firstversionist.polypane': polypane,
  'org.qt-project.Qt.QtWebEngineCore': qutebrowser,
  'com.apple.Safari': safari,
  'com.apple.SafariTechnologyPreview': safariTechnologyPreview,
  'org.torproject.torbrowser': tor,
  'com.vivaldi.Vivaldi': vivaldi,
  'com.vivaldi.Vivaldi.snapshot': vivaldiSnapshot,
  'ru.yandex.desktop.yandex-browser': yandex,
}
