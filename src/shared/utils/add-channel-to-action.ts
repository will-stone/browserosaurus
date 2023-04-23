import { produce } from 'immer'

import type { Channel } from '../state/channels'
import type { FSA } from '../state/model'

export const addChannelToAction = produce((draft: FSA, channel: Channel) => {
  draft.meta ||= {}
  draft.meta.channel = channel
})
