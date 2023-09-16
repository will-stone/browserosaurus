import { execSync } from 'node:child_process'
import path from 'node:path'

import { apps } from '../src/config/apps'

const allInstalledAppNames = new Set(
  execSync(
    'find ~/Applications /Applications -iname "*.app" -prune -not -path "*/.*" 2>/dev/null ||true',
  )
    .toString()
    .trim()
    .split('\n')
    .map((appPath) => path.parse(appPath).name),
)

const installedApps = Object.keys(apps).filter((appName) =>
  allInstalledAppNames.has(appName),
)

// eslint-disable-next-line no-console
console.log(installedApps)
