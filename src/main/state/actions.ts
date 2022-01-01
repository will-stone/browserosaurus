import type { Rectangle } from 'electron/main'
import type { CombinedState } from 'redux'

import type { AppId } from '../../config/apps'
import type { Data } from '../../shared/state/reducer.data'
import type { Storage } from '../../shared/state/reducer.storage'
import { actionNamespacer } from '../../shared/utils/action-namespacer'

const main = actionNamespacer('main')

const readiedApp = main('app/readied')

const openedUrl = main<string>('url/opened')

const changedPickerWindowBounds = main<Rectangle>(
  'picker-window-bounds/changed',
)

const installedAppsRetrieved = main<AppId[]>('installed-apps/retrieved')

const syncReducers =
  main<CombinedState<{ data: Data; storage: Storage }>>('sync-reducers')

const gotDefaultBrowserStatus = main<boolean>('default-browser-status/got')

const availableUpdate = main('update/available')
const downloadingUpdate = main('update/downloading')
const downloadedUpdate = main('update/downloaded')

const tray = actionNamespacer('tray')

const clickedRestorePicker = tray('restore-picker/clicked')
const clickedOpenPrefs = tray('open-prefs/clicked')

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
