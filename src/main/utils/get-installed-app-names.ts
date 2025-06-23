import { exec } from 'node:child_process'
import path from 'node:path'
import { promisify } from 'node:util'

import { sleep } from 'tings'

import type { AppName } from '../../config/apps.js'
import { apps } from '../../config/apps.js'
import { retrievedInstalledApps, startedScanning } from '../state/actions.js'
import { dispatch } from '../state/store.js'

const execAsync = promisify(exec)

async function getAllInstalledAppNames(): Promise<string[]> {
  try {
    const { stdout } = await execAsync(
      'find ~/Applications /Applications -iname "*.app" -prune -not -path "*/.*" 2>/dev/null ||true',
    )
    
    const appNames = stdout
      .toString()
      .trim()
      .split('\n')
      .filter(line => line.trim().length > 0)
      .map((appPath) => path.parse(appPath).name)

    return appNames
  } catch (error) {
    console.error('Error scanning for apps:', error)
    return []
  }
}

async function getInstalledAppNames(retryCount = 0): Promise<void> {
  const maxRetries = 3
  
  dispatch(startedScanning())

  const allInstalledAppNames = await getAllInstalledAppNames()

  const installedApps = Object.keys(apps).filter((appName) =>
    allInstalledAppNames.includes(appName),
  ) as AppName[]

  // It appears that sometimes the installed app IDs are not fetched, maybe a
  // race with Spotlight index? So if none found, keep retrying.
  // TODO is this needed any more, now using we're `find` method?
  // https://github.com/will-stone/browserosaurus/issues/425
  if (installedApps.length === 0 && retryCount < maxRetries) {
    console.log(`No apps found, retrying... (${retryCount + 1}/${maxRetries})`)
    // Exponential backoff
    await sleep(500 * (retryCount + 1))
    await getInstalledAppNames(retryCount + 1)
  } else {
    dispatch(retrievedInstalledApps(installedApps))
  }
}

export { getInstalledAppNames }
