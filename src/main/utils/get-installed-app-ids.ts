import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { homedir, uptime } from 'node:os'
import { join } from 'node:path'

import type { AppId } from '../../config/apps'
import { apps } from '../../config/apps'
import { retrievedInstalledApps, startedScanning } from '../state/actions'
import { dispatch } from '../state/store'

function getAllInstalledAppBundleIds(): [string[], string[]] {
  const allApps = spawnSync('mdfind', [
    '-onlyin',
    '/Applications',
    '-onlyin',
    join(homedir(), 'Applications'),
    'kind:app',
    '-attr',
    'kMDItemCFBundleIdentifier',
  ])
    .stdout.toString()
    .trim()
    .split('\n')

  const appPaths: string[] = []
  const bundleIds: string[] = []

  for (const result of allApps) {
    const pathAndId = result.split('   ')

    if (pathAndId.length === 2) {
      const appID = pathAndId[1].split(' = ')

      if (appID.length === 2) {
        appPaths.push(pathAndId[0])
        bundleIds.push(appID[1])
      }
    }
  }

  return [appPaths, bundleIds]
}

function getAllInstalledApps(): string[] {
  const hasUserAppsFolder = existsSync(join(homedir(), 'Applications'))
  let findArguments: string[]

  if (hasUserAppsFolder) {
    findArguments = [
      '/Applications',
      join(homedir(), 'Applications'),
      '-iname',
      '*.app',
      '-prune',
      '-not',
      '-path',
      '*/.*',
    ]
  } else {
    findArguments = [
      '/Applications',
      '-iname',
      '*.app',
      '-prune',
      '-not',
      '-path',
      '*/.*',
    ]
  }

  const allApps = spawnSync('find', findArguments)
    .stdout.toString()
    .trim()
    .split('\n')

  return allApps
}

function getVerifiedAppIds(): [boolean, string[]] {
  const [allInstalledAppPaths, allInstalledBundleIds] =
    getAllInstalledAppBundleIds()

  const allInstalledApps = getAllInstalledApps()

  let pathsMatch = true

  if (
    allInstalledApps.length !== 0 &&
    allInstalledApps.length === allInstalledAppPaths.length
  ) {
    for (const installedApp of allInstalledApps) {
      if (!allInstalledAppPaths.includes(installedApp)) {
        pathsMatch = false
        break
      }
    }
  } else {
    pathsMatch = false
  }

  return [pathsMatch, allInstalledBundleIds]
}

function msleep(n: number) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n)
}

function getInstalledAppIds(): void {
  dispatch(startedScanning())
  let pathsMatch: boolean
  let allInstalledBundleIds: string[]

  // It appears that sometimes the installed app IDs are not fetched, or is incomplete.
  // Maybe a race with Spotlight index? So to address this, the app paths from 'mdfind'
  // are compared with the app paths from 'find'. If no match, keep retrying but up to
  // a limit inversely related to the uptime of the system.
  // https://github.com/will-stone/browserosaurus/issues/572
  const sysUptime = uptime()
  let limit: number

  switch (true) {
    case sysUptime < 30:
      limit = 100
      break

    case sysUptime > 120:
      limit = 1
      break

    default:
      limit = -1.1 * sysUptime + 133
      break
  }

  for (let index = 0; index <= limit; index = index + 1) {
    ;[pathsMatch, allInstalledBundleIds] = getVerifiedAppIds()

    if (pathsMatch || index >= limit) {
      const installedApps: AppId[] = []

      for (const installedBundleId of allInstalledBundleIds) {
        if (installedBundleId in apps) {
          installedApps.push(installedBundleId as AppId)
        }
      }

      dispatch(retrievedInstalledApps(installedApps))
      break
    } else {
      msleep(500)
    }
  }
}

export { getInstalledAppIds }
