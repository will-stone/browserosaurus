import { execFile } from 'node:child_process'
import { homedir } from 'node:os'
import path from 'node:path'
import { promisify } from 'node:util'

import { sleep } from 'tings'

import type { AppId } from '../../config/apps'
import { apps } from '../../config/apps'
import { retrievedInstalledApps, startedScanning } from '../state/actions'
import { dispatch } from '../state/store'

const execFileP = promisify(execFile)

async function getAllInstalledBundleIds(): Promise<string[]> {
  const { stdout: allApps } = await execFileP('find', [
    '/Applications',
    path.join(homedir(), 'Applications'),
    "-iname '*.app'",
    '-maxdepth 1',
  ])

  const bundleIds = await Promise.all(
    allApps
      .trim()
      .split('\n')
      .map(async (entry) => {
        const { stdout: bundleId } = await execFileP('mdls', [
          '-name',
          'kMDItemCFBundleIdentifier',
          '-raw',
          entry,
        ])

        return bundleId
      }),
  )

  return bundleIds
}

async function getInstalledAppIds(): Promise<void> {
  dispatch(startedScanning())

  const allInstalledBundleIds = await getAllInstalledBundleIds()
  const installedApps: AppId[] = []

  for (const installedBundleId of allInstalledBundleIds) {
    if (installedBundleId in apps) {
      installedApps.push(installedBundleId as AppId)
    }
  }

  // It appears that sometimes the installed app IDs are not fetched, maybe a
  // race with Spotlight index? So if none found, keep retrying.
  // https://github.com/will-stone/browserosaurus/issues/425
  if (installedApps.length === 0) {
    await sleep(500)
    getInstalledAppIds()
  } else {
    dispatch(retrievedInstalledApps(installedApps))
  }
}

export { getInstalledAppIds }
