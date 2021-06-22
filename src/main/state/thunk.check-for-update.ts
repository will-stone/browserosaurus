import electronIsDev from 'electron-is-dev'

import { updateAvailable } from '../../shared/state/actions'
import type { AppThunk } from '../../shared/state/reducer.root'
import { isUpdateAvailable } from '../utils/is-update-available'

export const checkForUpdate = (): AppThunk => async (dispatch) => {
  if (!electronIsDev && (await isUpdateAvailable())) {
    dispatch(updateAvailable())
  }
}
