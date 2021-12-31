import type { AppId } from '../../../config/apps'
import { actionNamespacer } from '../../../shared/utils/action-namespacer'

const cA = actionNamespacer('picker')

interface OpenAppArguments {
  url: string
  appId: AppId | undefined
  isAlt: boolean
  isShift: boolean
}

const pickerStarted = cA('picker-window/started')

const clickedApp = cA<OpenAppArguments>('app-tile/clicked')

const pressedEscapeKey = cA('keyboard-shortcut/escape')
const pressedBackspaceKey = cA('keyboard-shortcut/backspace')
const pressedCopyKey = cA<string>('keyboard-shortcut/copy')
const pressedAppKey = cA<OpenAppArguments>('keyboard-shortcut/app')

const clickedUrlBar = cA('url-bar/clicked')

const clickedDonate = cA('donate/clicked')
const clickedMaybeLater = cA('maybe-later/clicked')

export {
  clickedApp,
  clickedDonate,
  clickedMaybeLater,
  clickedUrlBar,
  pickerStarted,
  pressedAppKey,
  pressedBackspaceKey,
  pressedCopyKey,
  pressedEscapeKey,
}
