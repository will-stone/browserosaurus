import log from 'electron-log'
// @ts-expect-error -- no types provided for file-icon
import fileIcon from 'file-icon'

import type { AppId } from '../../config/apps'
import type { Storage } from '../../shared/state/reducer.storage'
import { gotAppIcons } from '../state/actions'
import { dispatch } from '../state/store'

export async function getAppIcons(apps: Storage['apps']): Promise<void> {
  try {
    const buffers: (Buffer | null)[] = []

    for await (const app of apps) {
      try {
        const buffer = await fileIcon.buffer(app.id, { size: 64 })
        buffers.push(buffer)
      } catch {
        buffers.push(null)
      }
    }

    const icons: Partial<Record<AppId, string>> = {}

    for (const [index, buffer] of Object.entries(buffers)) {
      icons[apps[Number(index)].id] = buffer
        ? `data:image/png;base64,${buffer.toString('base64')}`
        : ''
    }

    dispatch(gotAppIcons(icons))
  } catch (error: unknown) {
    log.error(error)
    // eslint-disable-next-line no-console
    console.error('[getAppIcon error]', error)
  }
}
