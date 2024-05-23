import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

import type { AppName } from '../../config/apps.js'
import { apps } from '../../config/apps.js'

const pExecFile = promisify(execFile)

export function openApp(
  appName: AppName,
  url: string,
  isAlt: boolean,
  isShift: boolean,
): ReturnType<typeof pExecFile> {
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

  return pExecFile('open', openArguments)
}
