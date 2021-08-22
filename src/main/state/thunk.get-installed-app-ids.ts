import sleep from 'tings/sleep'

import { apps } from '../../config/apps'
import { syncAppIds } from '../../shared/state/actions'
import type { AppThunk } from '../../shared/state/reducer.root'
import { filterAppsByInstalled } from '../utils/filter-apps-by-installed'

export const getInstalledAppIds = (): AppThunk => async (dispatch) => {
  const installedApps = await filterAppsByInstalled(apps)
  // It appears that sometimes the installed app IDs are not fetched, maybe a
  // race with Spotlight index? So if none found, keep retrying.
  // https://github.com/will-stone/browserosaurus/issues/425
  if (installedApps.length === 0) {
    await sleep(500)
    dispatch(getInstalledAppIds())
  } else {
    dispatch(syncAppIds(installedApps))
  }
}
