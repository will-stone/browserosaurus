/* eslint-disable no-console */

import type { AnyAction } from '@reduxjs/toolkit'
import { blue, bold, magenta, white, yellow } from 'kolorist'

import { Channel } from '../state/channels'

const colorMap = {
  [Channel.MAIN]: yellow,
  [Channel.PREFS]: blue,
  [Channel.PICKER]: magenta,
}

export function actionLogger(action: AnyAction): void {
  const [channel, name]: [Channel, string] = action.type.split('/')

  console.log()
  console.log(
    `${bold(colorMap[channel](channel.padEnd(6)))} ${bold(white(name))}`,
  )
  console.log(action.payload)
  console.log()
}
