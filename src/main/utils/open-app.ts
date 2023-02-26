import { execFile } from 'child_process'

import type { AppName } from '../../config/apps'
import { apps } from '../../config/apps'

export function openApp(
  appName: AppName,
  url: string,
  isAlt: boolean,
  isShift: boolean,
): void {
  const selectedApp = apps[appName]

  const convertedUrl =
    'convertUrl' in selectedApp ? selectedApp.convertUrl(url) : url

  const openArguments: string[] = [
    '-a',
    appName,
    isAlt ? '--background' : [],
    isShift && 'privateArg' in selectedApp
      ? ['--new', '--args', selectedApp.privateArg]
      : [],
    // In order for private/incognito mode to work the URL needs to be passed
    // in last, _after_ the respective app.privateArg flag
    convertedUrl,
  ]
    .filter(Boolean)
    .flat()

  execFile('open', openArguments)
}
