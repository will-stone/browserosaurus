interface App {
  privateArg?: string
  convertUrl?: (url: string) => string
}

const typeApps = <T extends Record<string, App>>(apps: T) => apps

const apps = typeApps({
  'Arc': {},
  'Blisk': {},
  'Brave Beta': {
    privateArg: '--incognito',
  },
  'Brave Browser': {
    privateArg: '--incognito',
  },
  'Brave Dev': {
    privateArg: '--incognito',
  },
  'Brave Nightly': {
    privateArg: '--incognito',
  },
  'Chromium': {
    privateArg: '--incognito',
  },
  'Discord': {
    convertUrl: (url) =>
      url.replace(
        /^https?:\/\/(?:(?:ptb|canary)\.)?discord\.com\//u,
        'discord://-/',
      ),
  },
  'Discord Canary': {
    convertUrl: (url) =>
      url.replace(
        /^https?:\/\/(?:(?:ptb|canary)\.)?discord\.com\//u,
        'discord://-/',
      ),
  },
  'Discord PTB': {
    convertUrl: (url) =>
      url.replace(
        /^https?:\/\/(?:(?:ptb|canary)\.)?discord\.com\//u,
        'discord://-/',
      ),
  },
  'Dissenter': {},
  'DuckDuckGo': {},
  'Figma': {},
  'Finicky': {},
  'Firefox': {
    privateArg: '--private-window',
  },
  'Firefox Dev': {
    privateArg: '--private-window',
  },
  'Firefox Nightly': {
    privateArg: '--private-window',
  },
  'FreeTube': {},
  'Google Chrome': {
    privateArg: '--incognito',
  },
  'Google Chrome Beta': {
    privateArg: '--incognito',
  },
  'Google Chrome Canary': {
    privateArg: '--incognito',
  },
  'Google Chrome Dev': {
    privateArg: '--incognito',
  },
  'IceCat': {
    privateArg: '--private-window',
  },
  'Iridium': {},
  'LibreWolf': {
    privateArg: '--private-window',
  },
  'Linear': {},
  'Maxthon': {},
  'Microsoft Edge': {},
  'Microsoft Edge Beta': {},
  'Microsoft Edge Canary': {},
  'Microsoft Edge Dev': {},
  'Microsoft Teams': {
    convertUrl: (url) =>
      url.replace('https://teams.microsoft.com/', 'msteams:/'),
  },
  'Min': {},
  'Miro': {},
  'NAVER Whale': {},
  'Notion': {},
  'Opera': {},
  'Opera Beta': {},
  'Opera CD': {},
  'Opera Crypto': {},
  'Opera Dev': {},
  'Opera GX': {},
  'Opera Neon': {},
  'Orion': {},
  'Pocket': {
    convertUrl: (url) => `pocket://add?url=${url}`,
  },
  'Polypane': {},
  'qutebrowser': {},
  'Safari': {},
  'Safari TP': {},
  'Sidekick': {
    privateArg: '--incognito',
  },
  'SigmaOS': {},
  'Sizzy': {},
  'Slack': {},
  'Spotify': {},
  'Tor': {},
  'Twitter': {},
  'Vivaldi': {},
  'Vivaldi Snapshot': {},
  'Waterfox': {},
  'Wavebox': {
    privateArg: '--incognito',
  },
  'Whist': {},
  'Yandex': {},
  'Yattee': {},
  'Zoom': {},
  'zoom.us': {},
})

type Apps = typeof apps

type AppName = keyof typeof apps

export { AppName, Apps, apps }
