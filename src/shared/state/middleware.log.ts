/* eslint-disable no-console */
import { AnyAction, Middleware } from '@reduxjs/toolkit'
import { blue, bold, magenta, white, yellow } from 'kolorist'

import { Channel } from './channels'
import { RootState } from './reducer.root'

const colorMap = {
  [Channel.MAIN]: yellow,
  [Channel.PREFS]: blue,
  [Channel.TILES]: magenta,
}

/**
 * Log all actions to console
 */
export const logMiddleware =
  (): Middleware<
    // Legacy type parameter added to satisfy interface signature
    Record<string, unknown>,
    RootState
  > =>
  () =>
  (next) =>
  (action: AnyAction) => {
    /**
     * Move to next middleware
     */
    // eslint-disable-next-line node/callback-return -- must flush to get nextState
    const result = next(action)

    if (process.env.NODE_ENV === 'development') {
      const [channel, name]: [Channel, string] = action.type.split('/')

      console.log()
      console.log(
        `${bold(colorMap[channel](channel.padEnd(5)))} ${bold(white(name))}`,
      )
      console.log(action.payload)
      console.log()
    }

    return result
  }
