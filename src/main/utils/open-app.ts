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

  const processedUrlTemplate =
    'urlTemplate' in selectedApp
      ? selectedApp.urlTemplate.replace(/\{\{URL\}\}/u, url)
      : url

  const openArguments: string[] = [
    '-b',
    appId,
    isAlt ? '--background' : [],
    isShift && 'privateArg' in selectedApp
      ? ['--new', '--args', selectedApp.privateArg]
      : [],
    // In order for private/incognito mode to work the URL needs to be passed
    // in last, _after_ the respective app.privateArg flag
    processedUrlTemplate,
  ]
    .filter(Boolean)
    .flat()

  execFile('open', openArguments)
}
