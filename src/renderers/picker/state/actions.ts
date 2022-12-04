import type { AppName } from '../../../config/apps'
import { actionNamespacer } from '../../../shared/utils/action-namespacer'

const picker = actionNamespacer('picker')

interface OpenAppArguments {
  appName: AppName | undefined
  isAlt: boolean
  isShift: boolean
}

const startedPicker = picker('started')

const clickedApp = picker<OpenAppArguments>('app/clicked')

const pressedKey = picker<{
  virtualKey: string
  physicalKey: string
  metaKey: boolean
  altKey: boolean
  shiftKey: boolean
}>('key/pressed')

const clickedUrlBar = picker('url-bar/clicked')
const clickedUpdateBar = picker('update-bar/clicked')

const clickedDonate = picker('donate/clicked')
const clickedMaybeLater = picker('maybe-later/clicked')

export {
  clickedApp,
  clickedDonate,
  clickedMaybeLater,
  clickedUpdateBar,
  clickedUrlBar,
  pressedKey,
  startedPicker,
}
