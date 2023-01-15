import { execSync } from 'node:child_process'
import path from 'node:path'

import { sleep } from 'tings'

import { type AppName, apps } from '../../config/apps'
import { retrievedInstalledApps, startedScanning } from '../state/actions'
import { dispatch } from '../state/store'

function getAllInstalledAppNames(): string[] {
  const appNames = execSync(
    'find /Applications -iname "*.app" -prune -not -path "*/.*" 2>/dev/null',
  )
    .toString()
    .trim()
    .split('\n')
    .map((appPath) => path.parse(appPath).name)

  return appNames
}

async function getInstalledAppNames(): Promise<void> {
  dispatch(startedScanning())

  const allInstalledAppNames = getAllInstalledAppNames()

  const installedApps = Object.keys(apps).filter((appName) =>
    allInstalledAppNames.includes(appName),
  ) as AppName[]

  // It appears that sometimes the installed app IDs are not fetched, maybe a
  // race with Spotlight index? So if none found, keep retrying.
  // TODO is this needed any more, now using we're `find` method?
  // https://github.com/will-stone/browserosaurus/issues/425
  if (installedApps.length === 0) {
    await sleep(500)
    getInstalledAppNames()
  } else {
    dispatch(retrievedInstalledApps(installedApps))
  }
}

export { getInstalledAppNames }
