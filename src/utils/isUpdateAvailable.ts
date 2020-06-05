import fetch from 'node-fetch'
import semver from 'semver'

import { logger } from './logger'

export async function checkForUpdate(currentVersion: string): Promise<boolean> {
  try {
    const url = `https://api.github.com/repos/will-stone/browserosaurus/releases/latest`
    const rawData = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
    })

    const releaseInfo = await rawData.json()

    if (!rawData) {
      return false
    }

    const releaseNumber = releaseInfo.tag_name.startsWith('v')
      ? releaseInfo.tag_name.slice(1)
      : releaseInfo.tag_name

    return semver.gt(releaseNumber, currentVersion)
  } catch (error) {
    logger('Main', error.message)
    return false
  }
}
