import brave from '@browser-logos/brave/brave_128x128.png'
import braveBeta from '@browser-logos/brave-beta/brave-beta_128x128.png'
import braveDev from '@browser-logos/brave-dev/brave-dev_128x128.png'
import braveNightly from '@browser-logos/brave-nightly/brave-nightly_128x128.png'
import chrome from '@browser-logos/chrome/chrome_128x128.png'
import chromeBeta from '@browser-logos/chrome-beta/chrome-beta_128x128.png'
import chromeCanary from '@browser-logos/chrome-canary/chrome-canary_128x128.png'
import chromeDev from '@browser-logos/chrome-dev/chrome-dev_128x128.png'
import chromium from '@browser-logos/chromium/chromium_128x128.png'
import edge from '@browser-logos/edge/edge_128x128.png'
import edgeBeta from '@browser-logos/edge-beta/edge-beta_128x128.png'
import edgeCanary from '@browser-logos/edge-canary/edge-canary_128x128.png'
import edgeDev from '@browser-logos/edge-dev/edge-dev_128x128.png'
import firefox from '@browser-logos/firefox/firefox_128x128.png'
import firefoxDevEdition from '@browser-logos/firefox-developer-edition/firefox-developer-edition_128x128.png'
import firefoxNightly from '@browser-logos/firefox-nightly/firefox-nightly_128x128.png'
import icecat from '@browser-logos/icecat/icecat_128x128.png'
import iridium from '@browser-logos/iridium/iridium_128x128.png'
import maxthon from '@browser-logos/maxthon/maxthon_128x128.png'
import opera from '@browser-logos/opera/opera_128x128.png'
import operaBeta from '@browser-logos/opera-beta/opera-beta_128x128.png'
import operaDeveloper from '@browser-logos/opera-developer/opera-developer_128x128.png'
import operaGX from '@browser-logos/opera-gx/opera-gx_128x128.png'
import operaNeon from '@browser-logos/opera-neon/opera-neon_128x128.png'
import qutebrowser from '@browser-logos/qutebrowser/qutebrowser_128x128.png'
import safari from '@browser-logos/safari/safari_128x128.png'
import safariTechnologyPreview from '@browser-logos/safari-technology-preview/safari-technology-preview_128x128.png'
import tor from '@browser-logos/tor/tor_128x128.png'
import vivaldi from '@browser-logos/vivaldi/vivaldi_128x128.png'
import vivaldiSnapshot from '@browser-logos/vivaldi-snapshot/vivaldi-snapshot_128x128.png'
import yandex from '@browser-logos/yandex/yandex_128x128.png'

import dissenter from './logos/dissenter.png'
import figma from './logos/figma.png'
import finicky from './logos/finicky.png'
import freetube from './logos/freetubeapp.png'
import librewolf from './logos/librewolf.png'
import linear from './logos/linear.png'
import mighty from './logos/mighty.png'
import min from './logos/min.png'
import miro from './logos/miro.png'
import naverWhale from './logos/NAVER_whale.png'
import notion from './logos/notion.png'
import orion from './logos/orion.png'
import pocket from './logos/pocket.png'
import polypane from './logos/polypane.png'
import sidekick from './logos/sidekick.png'
import spotify from './logos/spotify.png'
import waterfox from './logos/waterfox.png'
import wavebox from './logos/wavebox.png'
import yattee from './logos/yattee.png'
import zoom from './logos/zoom.png'

interface App {
  name: string
  logo: string
  privateArg?: string
  convertUrl?: (url: string) => string
}

const typeApps = <T extends Record<string, App>>(apps: T) => apps

export const apps = typeApps({
  'com.brave.Browser': {
    name: 'Brave',
    privateArg: '--incognito',
    logo: brave,
  },
  'com.brave.Browser.beta': {
    name: 'Brave Beta',
    privateArg: '--incognito',
    logo: braveBeta,
  },
  'com.brave.Browser.dev': {
    name: 'Brave Dev',
    privateArg: '--incognito',
    logo: braveDev,
  },
  'com.brave.Browser.nightly': {
    name: 'Brave Nightly',
    privateArg: '--incognito',
    logo: braveNightly,
  },
  'com.google.Chrome': {
    name: 'Chrome',
    privateArg: '--incognito',
    logo: chrome,
  },
  'com.google.Chrome.beta': {
    name: 'Chrome Beta',
    privateArg: '--incognito',
    logo: chromeBeta,
  },
  'com.google.Chrome.canary': {
    name: 'Chrome Canary',
    privateArg: '--incognito',
    logo: chromeCanary,
  },
  'com.google.Chrome.dev': {
    name: 'Chrome Dev',
    privateArg: '--incognito',
    logo: chromeDev,
  },
  'org.chromium.Chromium': {
    name: 'Chromium',
    privateArg: '--incognito',
    logo: chromium,
  },
  'com.gab.Dissenter': {
    name: 'Dissenter',
    logo: dissenter,
  },
  'com.microsoft.edgemac': {
    name: 'Edge',
    logo: edge,
  },
  'com.microsoft.edgemac.Beta': {
    name: 'Edge Beta',
    logo: edgeBeta,
  },
  'com.microsoft.edgemac.Canary': {
    name: 'Edge Canary',
    logo: edgeCanary,
  },
  'com.microsoft.edgemac.Dev': {
    name: 'Edge Dev',
    logo: edgeDev,
  },
  'com.figma.Desktop': {
    name: 'Figma',
    logo: figma,
  },
  'net.kassett.finicky': {
    name: 'Finicky',
    logo: finicky,
  },
  'org.mozilla.icecat': {
    name: 'IceCat',
    privateArg: '--private-window',
    logo: icecat,
  },
  'org.mozilla.firefox': {
    name: 'Firefox',
    privateArg: '--private-window',
    logo: firefox,
  },
  'org.mozilla.firefoxdeveloperedition': {
    name: 'Firefox Dev',
    privateArg: '--private-window',
    logo: firefoxDevEdition,
  },
  'org.mozilla.nightly': {
    name: 'Firefox Nightly',
    privateArg: '--private-window',
    logo: firefoxNightly,
  },
  'io.freetubeapp.freetube': {
    name: 'FreeTube',
    logo: freetube,
  },
  'de.iridiumbrowser': {
    name: 'Iridium',
    logo: iridium,
  },
  'io.gitlab.librewolf-community.librewolf': {
    name: 'Librewolf',
    logo: librewolf,
  },
  'com.linear': {
    name: 'Linear',
    logo: linear,
  },
  'com.maxthon.mac.Maxthon': {
    name: 'Maxthon',
    logo: maxthon,
  },
  'com.mighty.app': {
    name: 'Mighty',
    privateArg: '--incognito',
    logo: mighty,
  },
  'com.electron.min': {
    name: 'Min',
    logo: min,
  },
  'com.electron.realtimeboard': {
    name: 'Miro',
    logo: miro,
  },
  'com.naver.Whale': {
    name: 'NAVER Whale',
    logo: naverWhale,
  },
  'notion.id': {
    name: 'Notion',
    logo: notion,
  },
  'com.operasoftware.Opera': {
    name: 'Opera',
    logo: opera,
  },
  'com.operasoftware.OperaNext': {
    name: 'Opera Beta',
    logo: operaBeta,
  },
  'com.operasoftware.OperaDeveloper': {
    name: 'Opera Dev',
    logo: operaDeveloper,
  },
  'com.operasoftware.OperaGX': {
    name: 'Opera GX',
    logo: operaGX,
  },
  'com.opera.Neon': {
    name: 'Opera Neon',
    logo: operaNeon,
  },
  'com.kagi.kagimacOS': {
    name: 'Orion',
    logo: orion,
  },
  'com.readitlater.PocketMac': {
    name: 'Pocket',
    convertUrl: (url) => `pocket://add?url=${url}`,
    logo: pocket,
  },
  'com.firstversionist.polypane': {
    name: 'Polypane',
    logo: polypane,
  },
  'org.qt-project.Qt.QtWebEngineCore': {
    name: 'qutebrowser',
    logo: qutebrowser,
  },
  'com.apple.Safari': {
    name: 'Safari',
    logo: safari,
  },
  'com.apple.SafariTechnologyPreview': {
    name: 'Safari TP',
    logo: safariTechnologyPreview,
  },
  'com.pushplaylabs.sidekick': {
    name: 'Sidekick',
    privateArg: '--incognito',
    logo: sidekick,
  },
  'com.spotify.client': {
    name: 'Spotify',
    logo: spotify,
  },
  'org.torproject.torbrowser': {
    name: 'Tor',
    logo: tor,
  },
  'com.vivaldi.Vivaldi': {
    name: 'Vivaldi',
    logo: vivaldi,
  },
  'com.vivaldi.Vivaldi.snapshot': {
    name: 'Vivaldi Snapshot',
    logo: vivaldiSnapshot,
  },
  'net.waterfox.waterfox': {
    name: 'Waterfox',
    logo: waterfox,
  },
  'com.bookry.wavebox': {
    name: 'Wavebox',
    logo: wavebox,
    privateArg: '--incognito',
  },
  'ru.yandex.desktop.yandex-browser': {
    name: 'Yandex',
    logo: yandex,
  },
  'stream.yattee.app': {
    name: 'Yattee',
    logo: yattee,
  },
  'us.zoom.xos': {
    name: 'Zoom',
    logo: zoom,
  },
})

export type Apps = typeof apps

export type AppId = keyof typeof apps
