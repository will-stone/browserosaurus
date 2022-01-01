import type { Rectangle } from 'electron/main'
import type { CombinedState } from 'redux'

import type { AppId } from '../../config/apps'
import type { Data } from '../../shared/state/reducer.data'
import type { Storage } from '../../shared/state/reducer.storage'
import { actionNamespacer } from '../../shared/utils/action-namespacer'

const cA = actionNamespacer('main')

const readiedApp = cA('app/readied')

const openedUrl = cA<string>('url/opened')

const changedPickerWindowBounds = cA<Rectangle>('picker-window-bounds/changed')

const installedAppsRetrieved = cA<AppId[]>('installed-apps/retrieved')

const syncReducers =
  cA<CombinedState<{ data: Data; storage: Storage }>>('sync-reducers')

const gotDefaultBrowserStatus = cA<boolean>('default-browser-status/got')

const availableUpdate = cA('update/available')
const downloadingUpdate = cA('update/downloading')
const downloadedUpdate = cA('update/downloaded')

const clickedRestorePicker = cA('restore-picker/clicked')
const clickedOpenPrefs = cA('open-prefs/clicked')

export {
  availableUpdate,
  changedPickerWindowBounds,
  clickedOpenPrefs,
  clickedRestorePicker,
  downloadedUpdate,
  downloadingUpdate,
  gotDefaultBrowserStatus,
  installedAppsRetrieved,
  openedUrl,
  readiedApp,
  syncReducers,
}
