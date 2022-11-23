import { execSync } from 'node:child_process'

import { sleep } from 'tings'

import type { AppId } from '../../config/apps'
import { apps } from '../../config/apps'
import { retrievedInstalledApps, startedScanning } from '../state/actions'
import { dispatch } from '../state/store'

function getAllInstalledBundleIds(): string[] {
  const bundleIds = execSync(
    'mdfind -onlyin /Applications kMDItemKind == \'*\' -attr kMDItemCFBundleIdentifier | sed -e "s/^.*kMDItemCFBundleIdentifier = //" -e "/(null)/d"',
  )
    .toString()
    .trim()
    .split('\n')

  return bundleIds
}

async function getInstalledAppIds(): Promise<void> {
  dispatch(startedScanning())

  const allInstalledBundleIds = getAllInstalledBundleIds()
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
