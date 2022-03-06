import { execFile } from 'child_process'

import type { AppId } from '../../config/apps'
import { apps } from '../../config/apps'

export function openApp(
  appId: AppId,
  url: string,
  isAlt: boolean,
  isShift: boolean,
): void {
  const selectedApp = apps[appId]

  const convertedUrl =
    'convertUrl' in selectedApp ? selectedApp.convertUrl(url) : url

  const openArguments: string[] = [
    '-b',
    appId,
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
