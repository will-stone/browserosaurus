import { apps } from '../../config/apps'
import { syncApps } from '../../shared/state/actions'
import type { AppThunk } from '../../shared/state/reducer.root'
import { filterAppsByInstalled } from '../utils/filter-apps-by-installed'

export const getApps = (): AppThunk => async (dispatch) => {
  const installedApps = await filterAppsByInstalled(apps)
  dispatch(syncApps(installedApps))
}
