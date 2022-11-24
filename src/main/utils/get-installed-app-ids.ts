import { execFile } from 'node:child_process'
import fs from 'node:fs'
import { homedir } from 'node:os'
import path from 'node:path'
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
    path.join(homedir(), 'Applications'),
    "kMDItemKind == '*'",
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

      if (appID.length === 2 && !appID[1].includes('null')) {
        appPaths.push(pathAndId[0])
        bundleIds.push(appID[1])
      }
    }
  }

  return [appPaths, bundleIds]
}

async function getAllInstalledApps(): Promise<string[]> {
  const hasUserAppsFolder = fs.existsSync(path.join(homedir(), 'Applications'))
  let findArguments: string[]

  if (hasUserAppsFolder) {
    findArguments = [
      '/Applications',
      path.join(homedir(), 'Applications'),
      '-iname',
      '*.app',
      '-prune',
      '-o',
      '-iname',
      '*.app',
    ]
  } else {
    findArguments = [
      '/Applications',
      '-iname',
      '*.app',
      '-prune',
      '-o',
      '-iname',
      '*.app',
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
  // Maybe a race with Spotlight index? So to address this the app paths from 'find'
  // are compared with the app paths from 'mdfind'. If no match, keep retrying.
  // https://github.com/will-stone/browserosaurus/issues/572
  for (let index = 0; index < 300; index = index + 1) {
    // eslint-disable-next-line no-await-in-loop
    ;[pathsMatch, allInstalledBundleIds] = await getVerifiedAppIds()

    if (pathsMatch) {
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
