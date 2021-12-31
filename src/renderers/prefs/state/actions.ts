import { createAction as cA } from '@reduxjs/toolkit'

import type { AppId } from '../../../config/apps'
import type { PrefsTab } from '../../../shared/state/reducer.data'

const prefsStarted = cA('prefs-window/started')

const clickedTabButton = cA<PrefsTab>('prefs-tab-button/clicked')

const clickedSetAsDefaultBrowserButton = cA(
  'set-as-default-browser-button/clicked',
)
const clickedRescanApps = cA('rescan-apps/clicked')
const clickedUpdateButton = cA('update-button/clicked')
const clickedUpdateRestartButton = cA('update-restart-button/clicked')

const changedHotCode = cA<{ appId: AppId; value: string }>('hot-code/updated')
const reorderedApps =
  cA<{ sourceId: AppId; destinationId: AppId }>('app/reordered')

const clickedHomepageButton = cA('homepage-button/clicked')
const clickedOpenIssueButton = cA('open-issue-button/clicked')

export {
  changedHotCode,
  clickedHomepageButton,
  clickedOpenIssueButton,
  clickedRescanApps,
  clickedSetAsDefaultBrowserButton,
  clickedTabButton,
  clickedUpdateButton,
  clickedUpdateRestartButton,
  prefsStarted,
  reorderedApps,
}
