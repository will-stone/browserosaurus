type App = {
  privateArg?: string
  convertUrl?: (url: string) => string
}

const typeApps = <T extends Record<string, App>>(apps: T) => apps

const apps = typeApps({
  'Arc': {},
  'Blisk': {},
  'Brave Browser': {
    privateArg: '--incognito',
  },
  'Brave Browser Beta': {
    privateArg: '--incognito',
  },
  'Brave Browser Nightly': {
    privateArg: '--incognito',
  },
  'Brave Dev': {
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
  'Epic': {},
  'Figma': {},
  'Figma Beta': {},
  'Finicky': {},
  'Firefox': {
    privateArg: '--private-window',
  },
  'Firefox Developer Edition': {
    privateArg: '--private-window',
  },
  'Firefox Nightly': {
    privateArg: '--private-window',
  },
  'Floorp': {},
  'Framer': {},
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
  'Island': {},
  'Lagrange': {},
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
  'Mullvad Browser': {
    privateArg: '--private-window',
  },
  'NAVER Whale': {},
  'Notion': {},
  'Opera': {},
  'Opera Beta': {},
  'Opera CD': {},
  'Opera Crypto': {},
  'Opera Dev': {},
  'Opera Developer': {},
  'Opera GX': {},
  'Opera Neon': {},
  'Orion': {},
  'Orion RC': {},
  'Pocket': {
    convertUrl: (url) => `pocket://add?url=${url}`,
  },
  'Polypane': {},
  'qutebrowser': {},
  'Safari': {},
  'Safari Technology Preview': {},
  'Sidekick': {
    privateArg: '--incognito',
  },
  'SigmaOS': {},
  'Sizzy': {},
  'Slack': {},
  'Spotify': {},
  'Thorium': {},
  'Tor Browser': {},
  'Twitter': {},
  'Ulaa': {
    privateArg: '--incognito',
  },
  'Vivaldi': {},
  'Vivaldi Snapshot': {},
  'Waterfox': {},
  'Wavebox': {
    privateArg: '--incognito',
  },
  'Whist': {},
  'Yandex': {},
  'Yattee': {},
  'zoom.us': {},
})

type Apps = typeof apps

type AppName = keyof typeof apps

export { AppName, Apps, apps }
