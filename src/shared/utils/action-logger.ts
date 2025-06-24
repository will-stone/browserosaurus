/* eslint-disable no-console */

import {
  bgBlue,
  bgMagenta,
  bgYellow,
  black,
  bold,
  gray,
  green,
  white,
} from 'picocolors'

import { Channel } from '../state/channels.js'
import type { FSA } from '../state/model.js'

const channelColorMap = {
  [Channel.MAIN]: bgYellow,
  [Channel.PREFS]: bgBlue,
  [Channel.PICKER]: bgMagenta,
  [Channel.GET_ICON]: bgYellow, // IPC channel, use same as MAIN
}

export function actionLogger(action: FSA): void {
  const channel = action.meta?.channel as Channel
  const [namespace] = action.type.split('/')
  const type = action.type.replace(`${namespace}/`, '')

  const channelLog = bold(channelColorMap[channel](black(channel.padEnd(6))))
  const namespaceLog = bold(green(namespace))
  const typeLog = bold(white(type))

  console.log(`${channelLog} ${namespaceLog}/${typeLog}`)

  if (action.payload) {
    console.log(
      gray(
        JSON.stringify(
          action.payload,
          (_, value) => {
            if (typeof value === 'string' && value.length > 100) {
              return `${value.slice(0, 100)}…`
            }

            return value
          },
          2,
        ),
      ),
    )
  }
}
