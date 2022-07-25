interface App {
  name: string
  privateArg?: string
  convertUrl?: (url: string) => string
}

const typeApps = <T extends Record<string, App>>(apps: T) => apps

export const apps = typeApps({
  'company.thebrowser.Browser': {
    name: 'Arc',
  },
  'org.blisk.Blisk': {
    name: 'Blisk',
  },
  'com.brave.Browser': {
    name: 'Brave',
    privateArg: '--incognito',
  },
  'com.brave.Browser.beta': {
    name: 'Brave Beta',
    privateArg: '--incognito',
  },
  'com.brave.Browser.dev': {
    name: 'Brave Dev',
    privateArg: '--incognito',
  },
  'com.brave.Browser.nightly': {
    name: 'Brave Nightly',
    privateArg: '--incognito',
  },
  'com.google.Chrome': {
    name: 'Chrome',
    privateArg: '--incognito',
  },
  'com.google.Chrome.beta': {
    name: 'Chrome Beta',
    privateArg: '--incognito',
  },
  'com.google.Chrome.canary': {
    name: 'Chrome Canary',
    privateArg: '--incognito',
  },
  'com.google.Chrome.dev': {
    name: 'Chrome Dev',
    privateArg: '--incognito',
  },
  'org.chromium.Chromium': {
    name: 'Chromium',
    privateArg: '--incognito',
  },
  'com.gab.Dissenter': {
    name: 'Dissenter',
  },
  'com.duckduckgo.macos.browser': {
    name: 'DuckDuckGo',
  },
  'com.microsoft.edgemac': {
    name: 'Edge',
  },
  'com.microsoft.edgemac.Beta': {
    name: 'Edge Beta',
  },
  'com.microsoft.edgemac.Canary': {
    name: 'Edge Canary',
  },
  'com.microsoft.edgemac.Dev': {
    name: 'Edge Dev',
  },
  'com.figma.Desktop': {
    name: 'Figma',
  },
  'net.kassett.finicky': {
    name: 'Finicky',
  },
  'org.mozilla.firefox': {
    name: 'Firefox',
    privateArg: '--private-window',
  },
  'org.mozilla.firefoxdeveloperedition': {
    name: 'Firefox Dev',
    privateArg: '--private-window',
  },
  'org.mozilla.nightly': {
    name: 'Firefox Nightly',
    privateArg: '--private-window',
  },
  'io.freetubeapp.freetube': {
    name: 'FreeTube',
  },
  'org.mozilla.icecat': {
    name: 'IceCat',
    privateArg: '--private-window',
  },
  'de.iridiumbrowser': {
    name: 'Iridium',
  },
  'org.mozilla.librewolf': {
    name: 'LibreWolf',
    privateArg: '--private-window',
  },
  'com.linear': {
    name: 'Linear',
  },
  'com.maxthon.mac.Maxthon': {
    name: 'Maxthon',
  },
  'com.microsoft.teams': {
    name: 'Microsoft Teams',
    convertUrl: (url) =>
      url.replace('https://teams.microsoft.com/', 'msteams:/'),
  },
  'com.mighty.app': {
    name: 'Mighty',
    privateArg: '--incognito',
  },
  'com.electron.min': {
    name: 'Min',
  },
  'com.electron.realtimeboard': {
    name: 'Miro',
  },
  'com.naver.Whale': {
    name: 'NAVER Whale',
  },
  'notion.id': {
    name: 'Notion',
  },
  'com.operasoftware.Opera': {
    name: 'Opera',
  },
  'com.operasoftware.OperaNext': {
    name: 'Opera Beta',
  },
  'com.operasoftware.OperaCryptoDeveloper': {
    name: 'Opera CD',
  },
  'com.operasoftware.OperaDeveloper': {
    name: 'Opera Dev',
  },
  'com.operasoftware.OperaGX': {
    name: 'Opera GX',
  },
  'com.opera.Neon': {
    name: 'Opera Neon',
  },
  'com.kagi.kagimacOS': {
    name: 'Orion',
  },
  'com.readitlater.PocketMac': {
    name: 'Pocket',
    convertUrl: (url) => `pocket://add?url=${url}`,
  },
  'com.firstversionist.polypane': {
    name: 'Polypane',
  },
  'org.qt-project.Qt.QtWebEngineCore': {
    name: 'qutebrowser',
  },
  'com.apple.Safari': {
    name: 'Safari',
  },
  'com.apple.SafariTechnologyPreview': {
    name: 'Safari TP',
  },
  'com.pushplaylabs.sidekick': {
    name: 'Sidekick',
    privateArg: '--incognito',
  },
  'com.sigmaos.sigmaos.macos': {
    name: 'SigmaOS',
  },
  'com.kitze.sizzy': {
    name: 'Sizzy',
  },
  'com.tinyspeck.slackmacgap': {
    name: 'Slack',
  },
  'com.spotify.client': {
    name: 'Spotify',
  },
  'org.torproject.torbrowser': {
    name: 'Tor',
  },
  'maccatalyst.com.atebits.Tweetie2': {
    name: 'Twitter',
  },
  'com.vivaldi.Vivaldi': {
    name: 'Vivaldi',
  },
  'com.vivaldi.Vivaldi.snapshot': {
    name: 'Vivaldi Snapshot',
  },
  'net.waterfox.waterfox': {
    name: 'Waterfox',
  },
  'com.bookry.wavebox': {
    name: 'Wavebox',
    privateArg: '--incognito',
  },
  'ru.yandex.desktop.yandex-browser': {
    name: 'Yandex',
  },
  'stream.yattee.app': {
    name: 'Yattee',
  },
  'us.zoom.xos': {
    name: 'Zoom',
  },
})

export type Apps = typeof apps

export type AppId = keyof typeof apps
