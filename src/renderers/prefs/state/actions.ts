import type { AppId } from '../../../config/apps'
import type { PrefsTab } from '../../../shared/state/reducer.data'
import { actionNamespacer } from '../../../shared/utils/action-namespacer'

const cA = actionNamespacer('prefs')

const startedPrefs = cA('started')

const clickedTabButton = cA<PrefsTab>('tab-button/clicked')

const clickedSetAsDefaultBrowserButton = cA(
  'set-as-default-browser-button/clicked',
)
const clickedRescanApps = cA('rescan-apps/clicked')
const clickedUpdateButton = cA('update-button/clicked')
const clickedUpdateRestartButton = cA('update-restart-button/clicked')

const updatedHotCode = cA<{ appId: AppId; value: string }>('hot-code/updated')
const reorderedApp =
  cA<{ sourceId: AppId; destinationId: AppId }>('app/reordered')

const clickedHomepageButton = cA('homepage-button/clicked')
const clickedOpenIssueButton = cA('open-issue-button/clicked')

export {
  clickedHomepageButton,
  clickedOpenIssueButton,
  clickedRescanApps,
  clickedSetAsDefaultBrowserButton,
  clickedTabButton,
  clickedUpdateButton,
  clickedUpdateRestartButton,
  reorderedApp,
  startedPrefs,
  updatedHotCode,
}
