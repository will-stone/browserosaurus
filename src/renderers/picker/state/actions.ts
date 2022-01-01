import type { AppId } from '../../../config/apps'
import { actionNamespacer } from '../../../shared/utils/action-namespacer'

const cA = actionNamespacer('picker')

interface OpenAppArguments {
  url: string
  appId: AppId | undefined
  isAlt: boolean
  isShift: boolean
}

const startedPicker = cA('started')

const clickedApp = cA<OpenAppArguments>('app/clicked')

const pressedEscapeKey = cA('escape-key/pressed')
const pressedBackspaceKey = cA('backspace-key/pressed')
const pressedCopyKey = cA<string>('copy-key/pressed')
const pressedAppKey = cA<OpenAppArguments>('app-key/pressed')

const clickedUrlBar = cA('url-bar/clicked')

const clickedDonate = cA('donate/clicked')
const clickedMaybeLater = cA('maybe-later/clicked')

export {
  clickedApp,
  clickedDonate,
  clickedMaybeLater,
  clickedUrlBar,
  pressedAppKey,
  pressedBackspaceKey,
  pressedCopyKey,
  pressedEscapeKey,
  startedPicker,
}
