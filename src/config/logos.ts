import braveBeta from '@browser-logos/brave-beta/brave-beta.svg'
import braveDev from '@browser-logos/brave-dev/brave-dev.svg'
import braveNightly from '@browser-logos/brave-nightly/brave-nightly_128x128.png'
import brave from '@browser-logos/brave/brave.svg'
import chromeCanary from '@browser-logos/chrome-canary/chrome-canary.svg'
import chrome from '@browser-logos/chrome/chrome.svg'
import chromium from '@browser-logos/chromium/chromium.svg'
import edgeBeta from '@browser-logos/edge-beta/edge-beta_128x128.png'
import edgeCanary from '@browser-logos/edge-canary/edge-canary_128x128.png'
import edgeDev from '@browser-logos/edge-dev/edge-dev_128x128.png'
import edge from '@browser-logos/edge/edge.svg'
import firefoxDevEdition from '@browser-logos/firefox-developer-edition/firefox-developer-edition.svg'
import firefoxNightly from '@browser-logos/firefox-nightly/firefox-nightly.svg'
import firefox from '@browser-logos/firefox/firefox.svg'
import iridium from '@browser-logos/iridium/iridium.svg'
import maxthon from '@browser-logos/maxthon/maxthon_128x128.png'
import operaBeta from '@browser-logos/opera-beta/opera-beta_128x128.png'
import operaDeveloper from '@browser-logos/opera-developer/opera-developer_128x128.png'
import operaGX from '@browser-logos/opera-gx/opera-gx.svg'
import opera from '@browser-logos/opera/opera.svg'
import qutebrowser from '@browser-logos/qutebrowser/qutebrowser.svg'
import safariTechnologyPreview from '@browser-logos/safari-technology-preview/safari-technology-preview_128x128.png'
import safari from '@browser-logos/safari/safari_128x128.png'
import tor from '@browser-logos/tor/tor_128x128.png'
import vivaldiSnapshot from '@browser-logos/vivaldi-snapshot/vivaldi-snapshot_128x128.png'
import vivaldi from '@browser-logos/vivaldi/vivaldi.svg'
import yandex from '@browser-logos/yandex/yandex_128x128.png'

import dissenter from './logos/dissenter.png'
import min from './logos/min.png'
import naverWhale from './logos/NAVER_whale.png'
import pocket from './logos/pocket.png'
import polypane from './logos/polypane.png'
import waterfox from './logos/waterfox.png'

export const logos: { [key: string]: string } = {
  'com.brave.Browser': brave,
  'com.brave.Browser.beta': braveBeta,
  'com.brave.Browser.dev': braveDev,
  'com.brave.Browser.nightly': braveNightly,
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
  'net.waterfox.waterfoxcurrent': waterfox,
  'ru.yandex.desktop.yandex-browser': yandex,
  'com.naver.Whale': naverWhale,
  'com.gab.Dissenter': dissenter,
}
