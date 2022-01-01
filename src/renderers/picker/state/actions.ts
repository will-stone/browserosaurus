import type { AppId } from '../../../config/apps'
import { actionNamespacer } from '../../../shared/utils/action-namespacer'

const cA = actionNamespacer('picker')

interface OpenAppArguments {
  appId: AppId | undefined
  isAlt: boolean
  isShift: boolean
}

const startedPicker = cA('started')

const clickedApp = cA<OpenAppArguments>('app/clicked')

const pressedKey = cA<{
  virtualKey: string
  physicalKey: string
  metaKey: boolean
  altKey: boolean
  shiftKey: boolean
}>('key/pressed')

const clickedUrlBar = cA('url-bar/clicked')

const clickedDonate = cA('donate/clicked')
const clickedMaybeLater = cA('maybe-later/clicked')

export {
  clickedApp,
  clickedDonate,
  clickedMaybeLater,
  clickedUrlBar,
  pressedKey,
  startedPicker,
}
