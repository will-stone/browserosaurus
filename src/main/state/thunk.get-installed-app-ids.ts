import { apps } from '../../config/apps'
import { syncAppIds } from '../../shared/state/actions'
import type { AppThunk } from '../../shared/state/reducer.root'
import { filterAppsByInstalled } from '../utils/filter-apps-by-installed'

export const getInstalledAppIds = (): AppThunk => async (dispatch) => {
  const installedApps = await filterAppsByInstalled(apps)
  dispatch(syncAppIds(installedApps))
}
