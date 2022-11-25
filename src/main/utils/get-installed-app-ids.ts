import { execFile } from 'node:child_process'
import { existsSync } from 'node:fs'
import { homedir, uptime } from 'node:os'
import { join } from 'node:path'
import { promisify } from 'node:util'

import { sleep } from 'tings'

import type { AppId } from '../../config/apps'
import { apps } from '../../config/apps'
import { retrievedInstalledApps, startedScanning } from '../state/actions'
import { dispatch } from '../state/store'

const execFileP = promisify(execFile)

async function getAllInstalledAppBundleIds(): Promise<[string[], string[]]> {
  const { stdout: allApps } = await execFileP('mdfind', [
    '-onlyin',
    '/Applications',
    '-onlyin',
    join(homedir(), 'Applications'),
    'kind:app',
    '-attr',
    'kMDItemCFBundleIdentifier',
  ])

  const appPaths: string[] = []
  const bundleIds: string[] = []
  const appsList = allApps.trim().split('\n')

  for (const result of appsList) {
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

async function getAllInstalledApps(): Promise<string[]> {
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

  const { stdout: allApps } = await execFileP('find', findArguments)
  const installedApps = allApps.trim().split('\n')

  return installedApps
}

async function getVerifiedAppIds(): Promise<[boolean, string[]]> {
  const [allInstalledAppPaths, allInstalledBundleIds] =
    await getAllInstalledAppBundleIds()

  const allInstalledApps = await getAllInstalledApps()

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

async function getInstalledAppIds(): Promise<void> {
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
      limit = 120
      break

    case sysUptime > 120:
      limit = 10
      break

    default:
      limit = -1.2 * sysUptime + 155
      break
  }

  for (let index = 0; index <= limit; index = index + 1) {
    // eslint-disable-next-line no-await-in-loop
    ;[pathsMatch, allInstalledBundleIds] = await getVerifiedAppIds()

    if (pathsMatch || index === limit) {
      const installedApps: AppId[] = []

      for (const installedBundleId of allInstalledBundleIds) {
        if (installedBundleId in apps) {
          installedApps.push(installedBundleId as AppId)
        }
      }

      dispatch(retrievedInstalledApps(installedApps))
      break
    } else {
      // eslint-disable-next-line no-await-in-loop
      await sleep(500)
    }
  }
}

export { getInstalledAppIds }
