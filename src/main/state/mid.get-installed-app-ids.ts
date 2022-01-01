import sleep from 'tings/lib/sleep'

import { apps } from '../../config/apps'
import { filterAppsByInstalled } from '../utils/filter-apps-by-installed'
import { installedAppsRetrieved } from './actions'
import { dispatch } from './store'

export async function getInstalledAppIds(): Promise<void> {
  const installedApps = await filterAppsByInstalled(apps)

  // It appears that sometimes the installed app IDs are not fetched, maybe a
  // race with Spotlight index? So if none found, keep retrying.
  // https://github.com/will-stone/browserosaurus/issues/425
  if (installedApps.length === 0) {
    await sleep(500)
    getInstalledAppIds()
  } else {
    dispatch(installedAppsRetrieved(installedApps))
  }
}
