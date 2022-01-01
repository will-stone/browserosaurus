import sleep from 'tings/lib/sleep'

import type { AppThunk } from '../../shared/state/reducer.root'
import { openedUrl } from './actions'

export const urlOpener =
  (url: string): AppThunk =>
  async (dispatch, getState) => {
    if (getState().data.pickerStarted) {
      dispatch(openedUrl(url))
    }
    // The `open-url` electron.app event can get fired before the picker window is
    // ready, if B was opened by sending it a URL. Here we wait before trying again.
    else {
      await sleep(500)
      dispatch(urlOpener(url))
    }
  }
