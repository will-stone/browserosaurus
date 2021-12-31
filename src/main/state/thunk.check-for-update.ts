import { app } from 'electron'

import type { AppThunk } from '../../shared/state/reducer.root'
import { isUpdateAvailable } from '../utils/is-update-available'
import { updateAvailable } from './actions'

export const checkForUpdate = (): AppThunk => async (dispatch) => {
  if (app.isPackaged && (await isUpdateAvailable())) {
    dispatch(updateAvailable())
  }
}
