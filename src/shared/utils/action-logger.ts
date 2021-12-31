/* eslint-disable no-console */

import {
  bgGreen,
  bgLightBlue,
  bgLightMagenta,
  black,
  bold,
  gray,
  white,
} from 'kolorist'

import { Channel } from '../state/channels'
import type { FSA } from '../state/model'

const channelColorMap = {
  [Channel.MAIN]: bgGreen,
  [Channel.PREFS]: bgLightBlue,
  [Channel.PICKER]: bgLightMagenta,
}

export function actionLogger(action: FSA): void {
  const channel = action.meta?.channel as Channel
  const [namespace] = action.type.split('/')
  const type = action.type.replace(`${namespace}/`, '')

  const channelLog = bold(channelColorMap[channel](black(channel.padEnd(6))))
  const namespaceLog = bold(gray(namespace))
  const typeLog = bold(white(type))

  console.log(`${channelLog} ${namespaceLog}/${typeLog}`)
  if (action.payload) console.log(action.payload)
}
