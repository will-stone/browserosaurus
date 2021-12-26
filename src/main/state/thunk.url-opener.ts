import sleep from 'tings/lib/sleep'

import { urlOpened } from '../../shared/state/actions'
import type { AppThunk } from '../../shared/state/reducer.root'

export const urlOpener =
  (url: string): AppThunk =>
  async (dispatch, getState) => {
    if (getState().data.pickerStarted) {
      dispatch(urlOpened(url))
    }
    // The `open-url` electron.app event can get fired before the picker window is
    // ready, if B was opened by sending it a URL. Here we wait before trying again.
    else {
      await sleep(500)
      dispatch(urlOpener(url))
    }
  }
