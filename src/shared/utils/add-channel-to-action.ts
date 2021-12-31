import type { AnyAction } from '@reduxjs/toolkit'
import produce from 'immer'

import type { Channel } from '../state/channels'

export const addChannelToAction = produce(
  (draft: AnyAction, channel: Channel) => {
    draft.meta ||= {}
    draft.meta.channel = channel
  },
)
