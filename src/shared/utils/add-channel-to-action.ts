import { produce } from 'immer'

import type { Channel } from '../state/channels.js'
import type { FSA } from '../state/model.js'

export const addChannelToAction = produce((draft: FSA, channel: Channel) => {
  draft.meta ||= {}
  draft.meta.channel = channel
})
