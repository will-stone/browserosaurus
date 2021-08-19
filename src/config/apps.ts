export const apps = {
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
  'org.chromium.Chromium': {
    name: 'Chromium',
    privateArg: '--incognito',
  },
  'com.gab.Dissenter': {
    name: 'Dissenter',
  },
  'net.kassett.finicky': {
    name: 'Finicky',
  },
  'org.mozilla.firefox': {
    name: 'Firefox',
    privateArg: '--private-window',
  },
  'org.mozilla.firefoxdeveloperedition': {
    name: 'Firefox Developer Edition',
    privateArg: '--private-window',
  },
  'org.mozilla.nightly': {
    name: 'Firefox Nightly',
    privateArg: '--private-window',
  },
  'com.google.Chrome': {
    name: 'Google Chrome',
    privateArg: '--incognito',
  },
  'com.google.Chrome.beta': {
    name: 'Google Chrome Beta',
    privateArg: '--incognito',
  },
  'com.google.Chrome.canary': {
    name: 'Google Chrome Canary',
    privateArg: '--incognito',
  },
  'com.google.Chrome.dev': {
    name: 'Google Chrome Dev',
    privateArg: '--incognito',
  },
  'de.iridiumbrowser': {
    name: 'Iridium',
  },
  'io.gitlab.librewolf-community.librewolf': {
    name: 'Librewolf',
  },
  'com.maxthon.mac.Maxthon': {
    name: 'Maxthon',
  },
  'com.microsoft.edgemac': {
    name: 'Microsoft Edge',
  },
  'com.microsoft.edgemac.Beta': {
    name: 'Microsoft Edge Beta',
  },
  'com.microsoft.edgemac.Canary': {
    name: 'Microsoft Edge Canary',
  },
  'com.microsoft.edgemac.Dev': {
    name: 'Microsoft Edge Dev',
  },
  'com.electron.min': {
    name: 'Min',
  },
  'com.naver.Whale': {
    name: 'NAVER Whale',
  },
  'com.operasoftware.Opera': {
    name: 'Opera',
  },
  'com.operasoftware.OperaNext': {
    name: 'Opera Beta',
  },
  'com.operasoftware.OperaDeveloper': {
    name: 'Opera Developer',
  },
  'com.operasoftware.OperaGX': {
    name: 'Opera GX',
  },
  'com.opera.Neon': {
    name: 'Opera Neon',
  },
  'com.readitlater.PocketMac': {
    name: 'Pocket',
    urlTemplate: 'pocket://add?url={{URL}}',
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
    name: 'Safari Technology Preview',
  },
  'com.spotify.client': {
    name: 'Spotify',
  },
  'org.torproject.torbrowser': {
    name: 'Tor Browser',
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
  'ru.yandex.desktop.yandex-browser': {
    name: 'Yandex',
  },
} as const

export type Apps = typeof apps

export type AppId = keyof typeof apps
