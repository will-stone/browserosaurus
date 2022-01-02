import type { AppId } from '../../../config/apps'
import type { PrefsTab } from '../../../shared/state/reducer.data'
import { actionNamespacer } from '../../../shared/utils/action-namespacer'

const prefs = actionNamespacer('prefs')

const startedPrefs = prefs('started')

const clickedTabButton = prefs<PrefsTab>('tab-button/clicked')

const clickedSetAsDefaultBrowserButton = prefs(
  'set-as-default-browser-button/clicked',
)
const clickedRescanApps = prefs('rescan-apps/clicked')
const clickedUpdateButton = prefs('update-button/clicked')
const clickedUpdateRestartButton = prefs('update-restart-button/clicked')
const confirmedReset = prefs('reset/confirmed')

const updatedHotCode =
  prefs<{ appId: AppId; value: string }>('hot-code/updated')
const reorderedApp =
  prefs<{ sourceId: AppId; destinationId: AppId }>('app/reordered')

const clickedHomepageButton = prefs('homepage-button/clicked')
const clickedOpenIssueButton = prefs('open-issue-button/clicked')

export {
  clickedHomepageButton,
  clickedOpenIssueButton,
  clickedRescanApps,
  clickedSetAsDefaultBrowserButton,
  clickedTabButton,
  clickedUpdateButton,
  clickedUpdateRestartButton,
  confirmedReset,
  reorderedApp,
  startedPrefs,
  updatedHotCode,
}
