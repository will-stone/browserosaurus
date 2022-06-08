import log from 'electron-log'
// @ts-expect-error -- no types provided for file-icon
import fileIcon from 'file-icon'

import type { AppId } from '../../config/apps'
import type { Storage } from '../../shared/state/reducer.storage'
import { gotAppIcons } from '../state/actions'
import { dispatch } from '../state/store'

export async function getAppIcons(apps: Storage['apps']): Promise<void> {
  try {
    const buffers: Buffer[] = await fileIcon.buffer(
      apps.map((app) => app.id),
      { size: 64 },
    )

    const icons: Partial<Record<AppId, string>> = {}

    for (const [index, buffer] of Object.entries(buffers)) {
      icons[apps[Number(index)].id] = `data:image/png;base64,${buffer.toString(
        'base64',
      )}`
    }

    dispatch(gotAppIcons(icons))
  } catch (error: unknown) {
    log.error(error)
    // eslint-disable-next-line no-console
    console.error('[getAppIcon error]', error)
  }
}
