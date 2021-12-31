/* eslint-disable no-console */

import { blue, bold, magenta, white, yellow } from 'kolorist'

import { Channel } from '../state/channels'
import type { FSA } from '../state/model'

const colorMap = {
  [Channel.MAIN]: yellow,
  [Channel.PREFS]: blue,
  [Channel.PICKER]: magenta,
}

export function actionLogger(action: FSA): void {
  const channel = action.meta?.channel as Channel

  console.log()
  console.log(
    `${bold(colorMap[channel](channel.padEnd(6)))} ${bold(white(action.type))}`,
  )
  console.log(action.payload)
  console.log()
}
